"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export default function useLogout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    if (!API_URL) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "No se encontró NEXT_PUBLIC_API_URL ni NEXT_PUBLIC_BACKEND_URL para cerrar sesión."
        );
      }
      router.replace("/");
      return;
    }

    try {
      await fetch(`${API_URL.replace(/\/$/, "")}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error al cerrar sesión:", error);
      }
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      router.replace("/");
    }
  }, [router]);

  return logout;
}
