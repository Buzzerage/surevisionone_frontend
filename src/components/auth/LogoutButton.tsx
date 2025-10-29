"use client";
import { LogOut, Loader } from "lucide-react";
import { useState } from "react";

import useLogout from "@/hooks/useLogout";

export default function LogoutButton() {
  const logout = useLogout();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
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
