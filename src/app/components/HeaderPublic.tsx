"use client";

import { LogIn } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "../arbitrages/components/ui/ThemeToggle"; // ✅ Añadido
import { useThemeContext } from "../components/ThemeProvider"; // ✅ Añadido
import { useRouter } from "next/navigation";

export default function HeaderPublic({ session, onLogin }) {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeContext(); // ✅ Añadido

  const isLogged =
    !!session && !!session.user && typeof session.user.email === "string";

  return (
    <header className="fixed top-0 left-0 w-full z-20 backdrop-blur-md bg-[var(--color-background-primary)]/80 border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          {/* 🔘 Toggle de tema */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {/* 👤 Botón de login / Ir al panel */}
          {!isLogged ? (
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-login-modal"))
              }
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9]"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Ir a tu cuenta
            </button>
          ) : (
            <button
              onClick={() => router.push("/arbitrages")}
              className="px-4 py-2 font-medium text-sm text-white bg-[var(--color-accent-primary)] hover:bg-[#0ea5e9] rounded-lg transition-colors"
            >
              Ir al panel
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
