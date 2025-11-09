import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Asegurar que solo se ejecuta en el cliente
let supabase: ReturnType<typeof createClient>;

if (typeof window !== "undefined") {
  if (!(window as any).__supabase_client__) {
    (window as any).__supabase_client__ = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "sb-session",
        flowType: "implicit", // <-- CAMBIADO, ESTO ES CLAVE
      },
    });
  }

  supabase = (window as any).__supabase_client__;
} else {
  // En el servidor devolvemos un cliente "vacío"
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
