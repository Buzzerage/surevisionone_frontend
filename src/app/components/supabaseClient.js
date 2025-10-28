import { createClient } from '@supabase/supabase-js';

// ✅ Lee las variables desde el entorno
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 🚨 Validación de entorno (para evitar errores silenciosos)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("❌ Faltan variables de entorno Supabase. Revisa tu .env.local");
}

// ⚙️ Configuración avanzada del cliente
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "sb-session",
    flowType: "pkce", // más seguro y recomendado
  },
  global: {
    fetch: async (url, options) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok && (res.status === 400 || res.status === 422)) return res;
        return res;
      } catch (err) {
        console.warn("⚠️ Error de red Supabase:", err);
        throw err;
      }
    },
  },
});
