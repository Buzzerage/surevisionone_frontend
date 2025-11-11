export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ✅ No bloquear restore-password
  if (req.nextUrl.pathname.startsWith("/restore-password")) {
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
