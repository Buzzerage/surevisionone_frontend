import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/server-client";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // 🔥 Evita interferir en callbacks de Supabase
  if (url.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(req, res);

  const { data } = await supabase.auth.getUser();

  const recoveryCookie = req.cookies.get("sv-recovery-session");
  if (recoveryCookie?.value === "1") {
    return NextResponse.redirect(new URL("/restore-password", req.url));
  }

  if (!data?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/panel/:path*", "/profile/:path*"],
};
