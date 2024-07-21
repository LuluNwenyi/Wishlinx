import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("saitama-token")?.value === "true";

  const unprotectedPaths = ["/signup", "/", "/confirm_email"];
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".scss")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/" && authToken) {
    req.nextUrl.pathname = "/home";
    return NextResponse.redirect(req.nextUrl);
  }

  const isProtectedRoute = !unprotectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
