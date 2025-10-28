"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (!API_BASE_URL) {
        throw new Error("No hay una URL de API configurada para cerrar la sesión.");
      }

      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("❌ Error cerrando sesión:", err);
    } finally {
      setLoading(false);
      router.replace("/");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {loading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>{loading ? "Cerrando..." : "Cerrar sesión"}</span>
    </button>
  );
}
