"use client";
import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useAuthSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/me`, {
          credentials: "include", // 🔥 Envía cookies
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else if (res.status === 401) {
          // 🔇 No es un error real: simplemente no hay sesión
          setUser(null);
        } else {
          // ⚠️ Otros errores (500, etc.) se registran
          const text = await res.text();
          console.warn("Error verificando sesión:", res.status, text);
          setError(new Error(`Error HTTP ${res.status}`));
        }
      } catch (err) {
        // ⚠️ Error de red o fetch
        console.warn("Error comprobando sesión:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, loading, error };
}
