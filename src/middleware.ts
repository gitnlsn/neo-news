import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./server/auth/config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isPrivateRoute = nextUrl.pathname.startsWith("/dashboard");
  if (!isAuthenticated && isPrivateRoute)
    return NextResponse.redirect(new URL("/", nextUrl));

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
