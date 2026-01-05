import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/server-client";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // 🔥 No interferir con callbacks de Supabase
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(req, res);

  const { data } = await supabase.auth.getUser();
  const recoveryCookie = req.cookies.get("sv-recovery-session")?.value === "1";

  // 🔐 Sesión recovery: solo puede acceder a restore-password
  if (recoveryCookie) {
    if (pathname !== "/restore-password") {
      return NextResponse.redirect(new URL("/restore-password", req.url));
    }
    return res;
  }

  // 🔒 Rutas protegidas (panel, profile, etc.)
  const isProtected =
    pathname.startsWith("/panel") || pathname.startsWith("/profile");

  if (isProtected && !data?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/panel/:path*",
    "/profile/:path*",
    "/restore-password",
  ],
};
