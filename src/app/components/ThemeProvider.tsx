// src/components/ThemeProvider.tsx
"use client";

import React, { createContext, useContext } from "react";
// Asumo que useTheme se encuentra en este path:
import { useTheme } from "../arbitrages/hooks/useTheme"; 

type ThemeContextType = {
    theme: string;
    toggleTheme: () => void;
};

// 1. Crear el Contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Hook personalizado para consumir el Contexto
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        // Esto asegura que el hook solo se use dentro del proveedor
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
};

// 3. El Componente Proveedor
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    // ⚠️ Ejecución del hook para aplicar el data-theme al <html>
    const { theme, toggleTheme } = useTheme();

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}