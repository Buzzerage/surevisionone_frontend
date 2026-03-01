import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cloudflare Pages always runs API routes on the edge runtime (Workers).
// Explicitly request the edge runtime so Next.js doesn’t try to bundle
// Node‑specific helpers. The nodejs runtime is not supported by Workers.
export const runtime = "edge"; // previously "nodejs"

type DeleteAccountRequestBody = {
  userId?: string;
};

async function readJsonBody(request: Request): Promise<DeleteAccountRequestBody | null> {
  try {
    const body = await request.json();
    if (body && typeof body === "object") {
      return body as DeleteAccountRequestBody;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("No se pudo parsear el cuerpo de la solicitud de eliminación", error);
    }
  }
  return null;
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "OPTIONS, POST",
    },
  });
}

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

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "No se pudo completar la solicitud. Falta la configuración del proyecto." },
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

    const parsedBody = await readJsonBody(request);
    const requestedUserId = parsedBody?.userId;

    if (requestedUserId && requestedUserId !== userData.user.id) {
      return NextResponse.json({ error: "No puedes eliminar esta cuenta." }, { status: 403 });
    }

    const deleteFunctionSlug =
      process.env.NEXT_PUBLIC_SUPABASE_DELETE_ACCOUNT_FUNCTION ??
      process.env.SUPABASE_DELETE_ACCOUNT_FUNCTION ??
      "delete_user";

    const deleteResponse = await fetch(`${supabaseUrl}/functions/v1/${deleteFunctionSlug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: userData.user.id }),
    });

    let deletePayload: unknown = null;
    const responseHasJson = deleteResponse.headers
      .get("content-type")
      ?.toLowerCase()
      .includes("application/json");

    if (responseHasJson) {
      deletePayload = await deleteResponse.json().catch(() => null);
    }

    if (!deleteResponse.ok) {
      const errorMessage =
        (deletePayload &&
          typeof deletePayload === "object" &&
          "error" in deletePayload &&
          typeof deletePayload.error === "string" &&
          deletePayload.error.length > 0 &&
          deletePayload.error) ||
        (deletePayload &&
          typeof deletePayload === "object" &&
          "message" in deletePayload &&
          typeof deletePayload.message === "string" &&
          deletePayload.message.length > 0 &&
          deletePayload.message) ||
        "No se pudo eliminar la cuenta.";

      const status = deleteResponse.status >= 400 ? deleteResponse.status : 502;

      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
