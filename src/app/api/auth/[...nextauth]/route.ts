import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// This handler initializes NextAuth 
const handler = NextAuth(authOptions);

// NextAuth requires GET and POST handlers
export { handler as GET, handler as POST };