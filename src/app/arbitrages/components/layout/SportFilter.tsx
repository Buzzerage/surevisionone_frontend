// src/components/layout/SportFilter.tsx
"use client";
import React from "react";
import { SPORT_FILTERS } from "../../utils/constants";
import { useLanguage } from "../../../context/LanguageProvider";

type SportFilterProps = {
    selectedSport: string;
    setSelectedSport: (sport: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
};

const SportFilter = ({ selectedSport, setSelectedSport, isSidebarOpen, setIsSidebarOpen }: SportFilterProps) => {
    const { t } = useLanguage();
    const handleSelectSport = (sportKey: string) => {
        setSelectedSport(sportKey);
        // Cierra la sidebar después de seleccionar un deporte en móvil
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <aside id="sport-sidebar" className={`sport-sidebar ${isSidebarOpen ? "open" : ""}`}>
            <h3 className="sidebar-title">{t('arbitrage.filters.heading') as string}</h3>
            <div className="filter-list">
                {SPORT_FILTERS.map((sport) => {
                    const Icon = sport.icon;
                    const isActive = selectedSport === sport.key;
                    return (
                        <button
                            key={sport.key}
                            className={`sport-item ${isActive ? "sport-item-active" : ""}`}
                            onClick={() => handleSelectSport(sport.key)}
                            aria-pressed={isActive}
                        >
                            <Icon className="sport-icon" />
                            <span className="sport-name">{t(sport.nameKey) as string}</span>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
};

export default SportFilter;