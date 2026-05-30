import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname, searchParams } = req.nextUrl;

    // 1. If no token, redirect to login
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    // 2. School Context Enforcement:
    // If the URL is missing the 'school' param, append the user's schoolId from the token
    if (!searchParams.has("school") && token.schoolId) {
      const url = req.nextUrl.clone();
      url.searchParams.set("school", token.schoolId as string);
      return NextResponse.redirect(url);
    }

    // 3. Role-based Access Control
    const role = token.role;
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") 
      return NextResponse.redirect(new URL("/login", req.url));

    if (pathname.startsWith("/dashboard/teacher") && role !== "TEACHER") 
      return NextResponse.redirect(new URL("/login", req.url));

    if (pathname.startsWith("/dashboard/student") && role !== "STUDENT") 
      return NextResponse.redirect(new URL("/login", req.url));
      
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*"] };