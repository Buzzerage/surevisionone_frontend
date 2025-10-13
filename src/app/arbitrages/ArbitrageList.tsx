// src/app/arbitrages/ArbitrageList.tsx

"use client";
import React, { useState, useMemo, useCallback } from "react";

// 1. Importaciones de Hooks
import useArbitrageWS from "./hooks/useArbitrageWS";
import { 
    calculateBackVsBackStakes, 
    calculateBackVsLayStakes 
} from "./hooks/useStakes"; // Asumiendo que useStakes.js/ts sigue en hooks/

// 2. Importaciones de Utilidades
import { Arbitrage, StakeResult } from "./utils/types";
import { SPORT_FILTERS } from "./utils/constants";

// 3. Importaciones de Componentes
import AppHeader from "./components/layout/AppHeader";
import SportFilter from "./components/layout/SportFilter";
import BankControl from "./components/ui/BankControl";
import ArbitrageCard from "./components/cards/ArbitrageCard";

import "./style.css"; // Estilos

export default function ArbitrageList() {
    const arbitrages: Arbitrage[] = useArbitrageWS("ws://10.0.0.102:8001/ws/arbitrages");
    const [bank, setBank] = useState<number>(100);
    const [selectedSport, setSelectedSport] = useState<string>("All");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Lógica para calcular las apuestas (depende del estado 'bank')
    const calculateStakes = useCallback((arb: Arbitrage): StakeResult => {
        if (arb.type === "Back vs Lay") {
            const { stake1, stake2, liability2 } = calculateBackVsLayStakes(bank, arb.back_odds || 0, arb.lay_odds || 0);
            return { stakeBack: stake1, stakeLay: stake2, liabilityLay: liability2 };
        }
        if (arb.type === "Back vs Back") {
            const { stake1, stake2 } = calculateBackVsBackStakes(bank, arb.home?.odds || 0, arb.away?.odds || 0);
            return { stakeHome: stake1, stakeAway: stake2 };
        }
        return {};
    }, [bank]);

    // Lógica de Filtrado (depende de 'arbitrages' y 'selectedSport')
    const filteredArbitrages = useMemo(() => {
        if (selectedSport === "All") return arbitrages;
        const selectedSportLower = selectedSport.toLowerCase();

        return arbitrages.filter(arb => 
            // Usa .includes() para buscar la clave del deporte
            arb.sport_key.toLowerCase().includes(selectedSportLower)
        );
    }, [arbitrages, selectedSport]);

    // Lógica de Agrupación (depende de 'filteredArbitrages')
    const grouped = useMemo(() => {
        return filteredArbitrages.reduce((acc, arb) => {
            const key = `${arb.home_team} vs ${arb.away_team} @ ${arb.match_date}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(arb);
            return acc;
        }, {} as Record<string, Arbitrage[]>);
    }, [filteredArbitrages]);

    const hasArbitrages = filteredArbitrages.length > 0;
    // Obtiene el nombre del deporte seleccionado para el título
    const currentSportName = SPORT_FILTERS.find(f => f.key === selectedSport)?.name || selectedSport;

    return (
        <>
            <AppHeader 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
            />
            
            {/* Backdrop para cerrar la sidebar en móvil */}
            {isSidebarOpen && <div className="backdrop" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />}

            <div className="main-layout">
                <SportFilter 
                    selectedSport={selectedSport} 
                    setSelectedSport={setSelectedSport} 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                />
                
                <main className="content-area">
                    <BankControl bank={bank} setBank={setBank} />
                    
                    <div className="arbitrage-panel">
                        <h2 className="panel-title">Oportunidades de Arbitraje {selectedSport !== 'All' ? `en ${currentSportName}` : ''}</h2>

                        {!hasArbitrages && (
                            <p className="no-arbs-message">
                                No hay oportunidades de arbitraje disponibles {selectedSport !== 'All' ? `para ${currentSportName}.` : 'en este momento.'}
                            </p>
                        )}

                        {Object.entries(grouped).map(([match, arbs]) => (
                            <div key={match} className="match-container">
                                <div className="match-header fade-in">
                                    <h3>{arbs[0].home_team} vs {arbs[0].away_team}</h3>
                                    {/* Busca el nombre del deporte a partir del sport_key del arbitraje */}
                                    <p>{arbs[0].sport} | {arbs[0].match_date}</p> 
                                </div>
                                <div className="arb-list-container">
                                    {arbs.map((arb: Arbitrage) => {
                                        const stakes = calculateStakes(arb);
                                        return <ArbitrageCard key={arb.id_arb} arb={arb} stakes={stakes} />;
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}