// src/components/layout/AppHeader.tsx
"use client";

import React from "react";
import ThemeToggle from "../ui/ThemeToggle";
import SportFilterToggle from "../ui/SportFilterToggle";
import Navigation from "./Navigation";
import LogoutButton from "../../../components/LogoutButton";
import { useThemeContext } from "../../../components/ThemeProvider";

const AppHeader = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="app-header flex items-center justify-between px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-primary)]">
      {/* ⬅️ IZQUIERDA: Logo + Navegación */}
      <div className="flex items-center gap-6">
        <h1 className="app-logo text-xl font-bold text-[var(--color-text-accent)]">
          ArbitrageHub
        </h1>
        <Navigation />
      </div>

      {/* ➡️ DERECHA: Filtros, Tema, Logout */}
      <div className="flex items-center gap-4">
        <SportFilterToggle
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <LogoutButton /> {/* 🔥 Botón de logout */}
      </div>
    </header>
  );
};

export default AppHeader;
