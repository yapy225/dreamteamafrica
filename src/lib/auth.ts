import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

/**
 * Rattache les ExhibitorBooking orphelins (créés par un admin ou un autre compte)
 * à l'utilisateur qui se connecte/s'inscrit avec le même email.
 * Upgrade automatiquement le rôle en EXPOSANT si des bookings existent.
 */
async function linkExhibitorBookings(userId: string, email: string) {
  try {
    // Find bookings with this email that belong to a different user (or no user match)
    const orphanBookings = await prisma.exhibitorBooking.findMany({
      where: {
        email: { equals: email, mode: "insensitive" },
        userId: { not: userId },
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailKey = (credentials.email as string).toLowerCase();

        // Account lockout: max 5 failed attempts per 15 min
        const lockoutKey = `login_fail:${emailKey}`;
        const now = Date.now();
        const g = globalThis as unknown as { _loginAttempts?: Map<string, { count: number; firstAt: number }> };
        if (!g._loginAttempts) g._loginAttempts = new Map();
        const attempts = g._loginAttempts;
        const entry = attempts.get(lockoutKey);
        if (entry && now - entry.firstAt < 15 * 60 * 1000 && entry.count >= 5) {
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
          // Track failed attempt
          if (entry && now - entry.firstAt < 15 * 60 * 1000) {
            entry.count++;
          } else {
            attempts.set(lockoutKey, { count: 1, firstAt: now });
          }
          return null;
        }

        // Reset on success
        attempts.delete(lockoutKey);

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
