// src/components/ui/SportFilterToggle.tsx
"use client";
import React from "react";
import { MdMenu, MdClose } from 'react-icons/md';
import { useLanguage } from "../../../context/LanguageProvider";

const SportFilterToggle = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void }) => {
    const { t } = useLanguage();
    const openLabel = t('arbitrage.filters.toggleOpen') as string;
    const closeLabel = t('arbitrage.filters.toggleClose') as string;
    const title = t('arbitrage.filters.toggleTitle') as string;

    return (
        <button
            className="sport-filter-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-controls="sport-sidebar"
            aria-expanded={isSidebarOpen}
            title={title}
        >
            {isSidebarOpen ? <MdClose /> : <MdMenu />}
            <span className="sr-only">{isSidebarOpen ? closeLabel : openLabel}</span>
        </button>
    );
};

export default SportFilterToggle;