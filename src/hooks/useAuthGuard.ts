"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSupabaseSession } from "./useSupabaseSession";

/**
 * Hook para proteger rutas que requieren autenticación.
 * Si no hay sesión válida, redirige automáticamente.
 * 
 * @param redirectTo Ruta a la que se redirige si no hay sesión (por defecto "/")
 * @returns { session, loading }
 */
export function useAuthGuard(redirectTo: string = "/") {
  const router = useRouter();
  const { session, loading } = useSupabaseSession();

  useEffect(() => {
    if (!loading && !session) {
      router.replace(redirectTo);
    }
  }, [loading, redirectTo, router, session]);

  return { session, loading };
}
