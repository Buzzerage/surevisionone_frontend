// src/components/ui/ThemeToggle.tsx
import React from "react";
import { MdOutlineWbSunny, MdOutlineNightlight } from 'react-icons/md';

const ThemeToggle = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => (
    <button
        className="theme-toggle-button"
        onClick={toggleTheme}
        aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
        {theme === 'light' ? <MdOutlineNightlight /> : <MdOutlineWbSunny />}
    </button>
);

export default ThemeToggle;