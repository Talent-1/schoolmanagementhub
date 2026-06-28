import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      type: string;
      schoolId?: string;
    };
  }

  interface User {
    role?: string;
    type?: string;
    schoolId?: string;
  }
}