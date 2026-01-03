"use client";

import { useRouter } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";

import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { supabase } from "@/lib/supabase/browser-client";
import { useThemeContext } from "@/providers/ThemeProvider";
import { useAppTranslations } from "@/lib/i18n";


type HeaderPrivateProps = {
  session: Session | null;
};

export default function HeaderPrivate({ session }: HeaderPrivateProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeContext();
  const headerCopy = useAppTranslations("header");
  const copy = headerCopy.private;
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userEmail = session?.user?.email ?? copy.defaultUser;
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.push("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background-primary)] border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between relative">
        <Logo />

        <div className="flex items-center gap-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu((p) => !p)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--color-background-secondary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)] transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">{userEmail}</span>
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden animate-fadeIn">
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    router.push("/profile");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--color-hover-bg)] transition"
                >
                  <Settings className="w-4 h-4" /> {copy.settings}
                </button>

                <button
                  onClick={() => {
                    setOpenMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[var(--color-hover-bg)] transition"
                >
                  <LogOut className="w-4 h-4" /> {copy.signOut}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </header>
  );
}
