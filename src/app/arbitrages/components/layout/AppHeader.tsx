// src/components/layout/AppHeader.tsx

import React from "react";
import ThemeToggle from "../ui/ThemeToggle";
import SportFilterToggle from "../ui/SportFilterToggle";
import Navigation from "./Navigation"; // Asumo que aún quieres la navegación
import { useThemeContext } from "../../../components/ThemeProvider"; 

// Eliminamos las props de tema ya que usamos Context
const AppHeader = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void }) => {
    
    const { theme, toggleTheme } = useThemeContext();

    return (
        <header className="app-header">
            {/* ⬅️ LADO IZQUIERDO: SOLO EL LOGO Y NAVEGACIÓN (juntos) */}
            <div className="header-left">
                <h1 className="app-logo">ArbitrageHub</h1>
                <Navigation /> 
            </div>
            
            {/* ➡️ LADO DERECHO: ÍCONO DE FILTRO Y BOTÓN DE TEMA */}
            <div className="header-right">
                {/* 🟢 El icono de filtro se queda aquí */}
                <SportFilterToggle isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
    );
};

export default AppHeader;