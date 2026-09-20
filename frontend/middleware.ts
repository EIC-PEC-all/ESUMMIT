import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply this middleware ONLY to these specific protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tickets/:path*",
    "/checkout/:path*",
  ],
};
