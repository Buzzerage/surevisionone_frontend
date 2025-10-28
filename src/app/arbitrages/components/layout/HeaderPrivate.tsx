"use client";

import { useRouter } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import Logo from "../../../components/Logo";
import { supabase } from "../../../components/supabaseClient";

export default function HeaderPrivate({ session }) {
  const router = useRouter();
  const userEmail = session?.user?.email ?? "Usuario";
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Logo />
        <div className="relative">
            <button
                onClick={() => setOpenMenu((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--color-background-secondary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)] transition-colors"
                >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">{userEmail}</span>
            </button>


          {openMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => router.push("/profile")}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--color-hover-bg)] transition"
              >
                <Settings className="w-4 h-4" /> Configuración
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[var(--color-hover-bg)] transition"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
