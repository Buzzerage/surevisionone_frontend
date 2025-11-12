import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const RECOVERY_COOKIE_NAME = "sv-recovery";

export async function middleware(req: NextRequest) {
  const isRestorePage = req.nextUrl.pathname.startsWith("/restore-password");
  const inRecoveryFlow = req.cookies.get(RECOVERY_COOKIE_NAME)?.value === "1";

  if (inRecoveryFlow && !isRestorePage) {
    const redirectUrl = new URL("/restore-password", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const res = NextResponse.next();

  // ✅ No bloquear restore-password
  if (isRestorePage) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set({ name, value, ...options }),
        remove: (name, options) => res.cookies.delete({ name, ...options }),
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/panel/:path*",
    // PERO EXCLUIR restore-password explícitamente
    "/((?!restore-password).*)"
  ],
};
