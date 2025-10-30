import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ["/panel"];

// Inicializa el cliente de Supabase con tu clave ANON
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Middleware de autenticación seguro
 * - Comprueba las cookies
 * - Verifica el token real con Supabase
 * - Redirige si el token no es válido o ha expirado
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo ejecuta en rutas protegidas
  if (!PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("sb-access-token")?.value;
  const refreshToken = req.cookies.get("sb-refresh-token")?.value;

  // Si no hay token → redirigir
  if (!accessToken || !refreshToken) {
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Verificamos el token directamente con Supabase
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data?.user) {
      console.warn("Token inválido o expirado:", error?.message);
      const redirectUrl = new URL("/", req.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Token válido → permitir el acceso
    return NextResponse.next();
  } catch (err) {
    console.error("Error verificando token en middleware:", err);
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

// Solo se ejecuta en rutas que empiecen por /panel
export const config = {
  matcher: ["/panel/:path*"],
};
