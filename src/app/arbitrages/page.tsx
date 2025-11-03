"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ArbitrageList from "./ArbitrageList";
import useAuthSession from "../hooks/useAuthSession";

export default function ArbitragesPage() {
  const router = useRouter();
  const { user, loading } = useAuthSession();

  // 🔁 Redirige solo cuando termina de cargar y no hay sesión
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // ✅ replace evita que quede en el historial
    }
  }, [loading, user, router]);

  // ⏳ Muestra mensaje mientras verifica la sesión
  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando sesión...</p>;
  }

  // 🚫 Si no hay sesión, no renderizamos nada (ya se está redirigiendo)
  if (!user) {
    return null;
  }

  // ✅ Si hay sesión, renderiza el contenido
  return <ArbitrageList user={user} />;
}
