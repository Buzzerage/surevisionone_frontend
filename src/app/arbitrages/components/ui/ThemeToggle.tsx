// src/components/ui/ThemeToggle.tsx
"use client";
import React from "react";
import { MdOutlineWbSunny, MdOutlineNightlight } from 'react-icons/md';
import { useLanguage } from "../../../context/LanguageProvider";

const ThemeToggle = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => {
    const { t } = useLanguage();
    const label = `${t('common.theme')} ${theme === 'light' ? 'dark' : 'light'}`;

    return (
        <button
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
        >
            {theme === 'light' ? <MdOutlineNightlight /> : <MdOutlineWbSunny />}
        </button>
    );
};

export default ThemeToggle;