"use client";

import { useState, useEffect } from "react";
import { supabase } from "../components/supabaseClient";

/**
 * Hook que mantiene el estado de sesión sincronizado con Supabase Auth.
 * Detecta login/logout en tiempo real y devuelve el objeto de sesión.
 */
export function useSupabaseSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
        const { data } = await supabase.auth.getSession();
        const s = data?.session ?? null;

        if (s?.user) {
        setSession(s);
        } else {
        // 💡 Limpia token caducado o corrupto
        document.cookie =
            "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setSession(null);
        }

        setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession ?? null);
    });

    return () => listener.subscription.unsubscribe();
    }, []);

  return { session, loading };
}
