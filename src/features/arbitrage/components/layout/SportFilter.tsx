// src/components/layout/SportFilter.tsx
import React from "react";
import { SPORT_FILTERS } from "../../utils/constants";

type SportFilterProps = {
    selectedSport: string;
    setSelectedSport: (sport: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
};

const SportFilter = ({ selectedSport, setSelectedSport, isSidebarOpen, setIsSidebarOpen }: SportFilterProps) => {
    const handleSelectSport = (sportKey: string) => {
        setSelectedSport(sportKey);
        // Cierra la sidebar después de seleccionar un deporte en móvil
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <aside id="sport-sidebar" className={`sport-sidebar ${isSidebarOpen ? "open" : ""}`}>
            <h3 className="sidebar-title">FILTRAR DEPORTES</h3>
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
                            <span className="sport-name">{sport.name}</span>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
};

export default SportFilter;