"use client";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // envía cookies
      });

      // Limpia cualquier caché local si existiera
      localStorage.removeItem("user");

      // Redirige al inicio
      router.replace("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return logout;
}
