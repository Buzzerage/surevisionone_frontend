"use client";

import { useState, useEffect } from "react";
import { supabase } from "../components/supabaseClient";

/**
 * Hook unificado para manejar autenticación y sesión de usuario con Supabase.
 * Sustituye completamente a los antiguos useAuthSession y useSupabaseSession.
 */
export function useSupabaseSession() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const currentSession = data?.session ?? null;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (err) {
        console.error("❌ Error obteniendo sesión Supabase:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    init();

    // 🔁 Listener en tiempo real para login/logout/token refresh
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
      } else {
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, error };
}
