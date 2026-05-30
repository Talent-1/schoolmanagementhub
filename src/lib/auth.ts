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

        // 1. Staff/Teacher/Admin Login
        const staff = await prisma.staff.findFirst({
          where: { email: identifier.toLowerCase() },
        });

        if (staff && (await bcrypt.compare(password, staff.password))) {
          return { 
            id: staff.id, 
            name: staff.name, 
            email: staff.email, 
            role: staff.role, 
            type: "STAFF" 
          };
        }

        // 2. Student Login
        // We use findFirst because regNumber is unique, but it's often not the primary key
        const student = await prisma.student.findFirst({
          where: { regNumber: identifier.toUpperCase() },
        });

        // Use bcrypt.compare here to validate the hashed password
        if (student && (await bcrypt.compare(password, student.password))) {
          return { 
            id: student.id, 
            name: `${student.firstName} ${student.lastName}`, 
            email: student.regNumber, 
            role: "STUDENT", 
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
        token.email = (user as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).type = token.type;
        (session.user as any).email = token.email;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};