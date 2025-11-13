import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createSupabaseServerClient(req, res);

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/panel/:path*"],
};
