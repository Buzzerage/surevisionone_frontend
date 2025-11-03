"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../components/supabaseClient";
import type { Session } from "@supabase/supabase-js";

/**
 * Hook para proteger rutas que requieren autenticación.
 * Si no hay sesión válida, redirige automáticamente.
 * 
 * @param redirectTo Ruta a la que se redirige si no hay sesión (por defecto "/")
 * @returns { session, loading }
 */
export function useAuthGuard(redirectTo: string = "/") {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error al obtener sesión:", error);
          router.replace(redirectTo);
          return;
        }

        if (data?.session) {
          setSession(data.session);
        } else {
          router.replace(redirectTo);
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
        router.replace(redirectTo);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escucha cambios de sesión (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace(redirectTo);
      else setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, [router, redirectTo]);

  return { session, loading };
}
