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
  session: { strategy: "jwt" },
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

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
      }
      // Refresh role from DB on every sign-in (in case it was upgraded)
      if (trigger === "signIn" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role;
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
