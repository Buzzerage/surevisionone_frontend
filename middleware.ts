import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware de autenticación
 * - Verifica sesión usando cookies reales de Supabase
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  // Si no hay usuario → redirigir al home
  if (!data?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/panel/:path*"],
};
