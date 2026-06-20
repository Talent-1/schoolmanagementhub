import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Reg Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const identifier = credentials.email.trim();
        const password = credentials.password;

        const staff = await prisma.staff.findFirst({
          where: { email: identifier.toLowerCase() },
        });

        if (staff && (await bcrypt.compare(password, staff.password))) {
          return { 
            id: staff.id, 
            name: staff.name, 
            email: staff.email, 
            role: staff.role, 
            schoolId: staff.schoolId, // Ensure schoolId is returned
            type: "STAFF" 
          };
        }

        const student = await prisma.student.findFirst({
          where: { regNumber: identifier.toUpperCase() },
        });

        if (student && (await bcrypt.compare(password, student.password))) {
          return { 
            id: student.id, 
            name: `${student.firstName} ${student.lastName}`, 
            email: student.regNumber, 
            role: "STUDENT", 
            schoolId: student.schoolId, // Ensure schoolId is returned
            type: "STUDENT" 
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.type = (user as any).type;
        token.schoolId = (user as any).schoolId; // Map schoolId to token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).type = token.type;
        (session.user as any).schoolId = token.schoolId; // Map schoolId to session
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};