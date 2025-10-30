import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const bearerPrefix = "Bearer ";

    if (!authorization || !authorization.startsWith(bearerPrefix)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const token = authorization.slice(bearerPrefix.length);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Faltan credenciales del servidor para completar la solicitud." },
        { status: 500 }
      );
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });

    const { data: userData, error: getUserError } = await authClient.auth.getUser(token);

    if (getUserError || !userData?.user) {
      return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
    }

    const { userId } = await request.json().catch(() => ({ userId: null }));

    if (!userId || userId !== userData.user.id) {
      return NextResponse.json({ error: "No puedes eliminar esta cuenta." }, { status: 403 });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message || "No se pudo eliminar la cuenta." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
