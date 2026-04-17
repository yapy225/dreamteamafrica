import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { rateLimitStrict, getClientIp } from "./rate-limit";

/**
 * Rattache les ExhibitorBooking orphelins (créés par un admin ou un autre compte)
 * à l'utilisateur qui se connecte/s'inscrit avec le même email.
 * Upgrade automatiquement le rôle en EXPOSANT si des bookings existent.
 */
async function linkExhibitorBookings(userId: string, email: string) {
  try {
    // Link ONLY bookings that belong to a placeholder/ghost user (no password set yet).
    // This prevents a data-entry mistake (admin assigning a booking to the wrong user with
    // the same email) from letting one user sign in and silently steal another's bookings.
    const orphanBookings = await prisma.exhibitorBooking.findMany({
      where: {
        email: { equals: email, mode: "insensitive" },
        userId: { not: userId },
        user: { password: null },
      },
      select: { id: true },
    });

    if (orphanBookings.length > 0) {
      // Reassign bookings to this user
      await prisma.exhibitorBooking.updateMany({
        where: { id: { in: orphanBookings.map((b) => b.id) } },
        data: { userId },
      });

      // Also reassign linked profiles
      await prisma.exhibitorProfile.updateMany({
        where: {
          bookingId: { in: orphanBookings.map((b) => b.id) },
        },
        data: { userId },
      });

      console.log(
        `[AUTH] Linked ${orphanBookings.length} exhibitor booking(s) to user ${userId} (${email})`
      );
    }

    // Check if user has any active bookings → upgrade role to EXPOSANT
    const hasBookings = await prisma.exhibitorBooking.findFirst({
      where: { userId, status: { in: ["PARTIAL", "CONFIRMED"] } },
      select: { id: true },
    });

    if (hasBookings) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      // Only upgrade USER → EXPOSANT, don't downgrade ADMIN or ARTISAN
      if (user?.role === "USER") {
        await prisma.user.update({
          where: { id: userId },
          data: { role: "EXPOSANT" },
        });
        console.log(`[AUTH] Auto-upgraded user ${userId} to EXPOSANT`);
      }
    }
  } catch (err) {
    console.error("[AUTH] linkExhibitorBookings error:", err);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as never,
  session: { strategy: "jwt", maxAge: 1800 },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailKey = (credentials.email as string).toLowerCase();
        const ip = request ? getClientIp(request) : "unknown";

        // Defense-in-depth — deux compteurs indépendants, le plus strict gagne:
        //  - par email: 5 essais / 15 min (protège un compte ciblé)
        //  - par IP: 30 essais / 15 min (protège contre credential stuffing distribué sur plusieurs comptes)
        const [emailLockout, ipLockout] = await Promise.all([
          rateLimitStrict(`login_fail:${emailKey}`, { limit: 5, windowSec: 15 * 60 }),
          rateLimitStrict(`login_fail_ip:${ip}`, { limit: 30, windowSec: 15 * 60 }),
        ]);
        if (!emailLockout.success || !ipLockout.success) {
          throw new Error("ACCOUNT_LOCKED");
        }

        const user = await prisma.user.findUnique({
          where: { email: emailKey },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // Login réussi : reset le compteur email (IP reste — l'IP peut attaquer plusieurs comptes).
        try {
          await prisma.rateLimitEntry.delete({ where: { id: `login_fail:${emailKey}` } });
        } catch {
          // ok si la clé n'existait pas encore
        }

        // 2FA check: if enabled, verify TOTP code
        if (user.totpEnabled && user.totpSecret) {
          const totpCode = (credentials as Record<string, unknown>).totpCode as string | undefined;
          if (!totpCode) {
            throw new Error("TOTP_REQUIRED");
          }
          try {
            const { verifyTotp } = await import("@/lib/totp");
            const { decrypt } = await import("@/lib/crypto");
            const secret = decrypt(user.totpSecret);
            if (!verifyTotp(totpCode, secret)) {
              throw new Error("TOTP_INVALID");
            }
          } catch (e: unknown) {
            if (e instanceof Error && (e.message === "TOTP_REQUIRED" || e.message === "TOTP_INVALID")) throw e;
            throw new Error("TOTP_INVALID");
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.id && user?.email) {
        await linkExhibitorBookings(user.id, user.email);
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id!;
        token.roleRefreshedAt = Date.now();
      }
      // Refresh role from DB on sign-in or every 5 minutes
      const ROLE_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 min
      const lastRefresh = (token.roleRefreshedAt as number) || 0;
      const shouldRefresh = trigger === "signIn" || (Date.now() - lastRefresh > ROLE_REFRESH_INTERVAL);

      if (shouldRefresh && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.roleRefreshedAt = Date.now();
          }
        } catch {
          // DB error — keep existing role
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
