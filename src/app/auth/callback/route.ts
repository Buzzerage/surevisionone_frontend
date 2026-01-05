import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/panel";

  const supabase = await createSupabaseServerClient();

  // 🔹 LOGIN / OAUTH / MAGIC LINK (PKCE)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${url.origin}${next}`);
    }
  }

  // 🔹 PASSWORD RECOVERY
  if (type === "recovery") {
    // Supabase ya ha puesto la sesión en cookies
    return NextResponse.redirect(`${url.origin}${next}`);
  }

  // 🔻 Cualquier otro caso es error real
  return NextResponse.redirect(`${url.origin}/auth/auth-code-error`);
}
