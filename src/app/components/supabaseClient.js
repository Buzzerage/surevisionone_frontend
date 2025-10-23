import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yichhczijwrsnpxdyoak.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2JNBcWAYnq0ZDGylaaxPqA_z4CEJYN9';


// Variables de entorno (asegúrate de tenerlas en tu .env.local)
//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ⚙️ Configuración avanzada del cliente
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Al usar local dev sin HTTPS, evita que las cookies seguras den warning
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

        // Si Supabase devuelve 400 o 422, no queremos que se vea como “error rojo”
        if (!res.ok && (res.status === 400 || res.status === 422)) {
          // Devuelve la respuesta sin log ni excepción
          return res;
        }

        return res;
      } catch (err) {
        // Cualquier otro error real de red (timeout, DNS, etc.)
        console.warn("⚠️ Error de red Supabase:", err);
        throw err;
      }
    },
  },
});

