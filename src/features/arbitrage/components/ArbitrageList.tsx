"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import useArbitrageRealtime from "../hooks/useArbitrageRealtime";

import {
  calculateBackVsBackStakes,
  calculateBackVsLayStakes,
} from "../hooks/useStakes";

import { SPORT_FILTERS } from "../utils/constants";
import SportFilter from "./layout/SportFilter";
import BankControl from "./ui/BankControl";
import ArbitrageCard from "./cards/ArbitrageCard";
import type { Arbitrage, StakeResult } from "../utils/types";

export default function ArbitrageList() {
  const { arbitrages, status, lastDelta } = useArbitrageRealtime();
  const [showOverlay, setShowOverlay] = useState(true);
  const [fadeClass, setFadeClass] = useState("fade-in");
  const [bank, setBank] = useState<number>(100);
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🧮 Cálculo de stakes adaptado a tus datos reales
  const calculateStakes = useCallback(
    (arb: Arbitrage): StakeResult => {
      if (arb.type === "Back vs Lay") {
        return calculateBackVsLayStakes(bank, arb.back_odds ?? 0, arb.lay_odds ?? 0);
      }

      if (arb.type === "Back vs Back") {
        const homeOdds = arb.home?.odds ?? 0;
        const awayOdds = arb.away?.odds ?? 0;
        return calculateBackVsBackStakes(bank, homeOdds, awayOdds);
      }

      return {};
    },
    [bank]
  );

  // 🧭 Control de overlay de carga
  useEffect(() => {
    if (status === "open" && arbitrages.length > 0) {
      setFadeClass("fade-out");
      const timer = setTimeout(() => setShowOverlay(false), 300);
      return () => clearTimeout(timer);
    } else if (status === "connecting") {
      setShowOverlay(true);
      setFadeClass("fade-in");
    }
  }, [status, arbitrages]);

  // 🧩 Filtrado por deporte
  const filteredArbitrages = useMemo(() => {
    if (selectedSport === "All") return arbitrages;
    const sportKey = selectedSport.toLowerCase();
    return arbitrages.filter((arb) =>
      arb.sport_key?.toLowerCase().includes(sportKey)
    );
  }, [arbitrages, selectedSport]);

  // 🔗 Agrupación por partido
  const grouped = useMemo(() => {
    return filteredArbitrages.reduce<Record<string, Arbitrage[]>>((acc, arb) => {
      const key = `${arb.home_team} vs ${arb.away_team} @ ${arb.match_date}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(arb);
      return acc;
    }, {});
  }, [filteredArbitrages]);

  const hasArbitrages = filteredArbitrages.length > 0;
  const currentSportName =
    SPORT_FILTERS.find((f) => f.key === selectedSport)?.name || selectedSport;

  // 🌀 Tarjeta animada de carga
  const LoadingCard = () => (
    <div className="match-container fade-in">
      <div className="match-header shimmer">
        <div className="h-5 w-2/3 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 w-1/3 bg-gray-700 rounded"></div>
      </div>
      <div className="arb-list-container">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="arbitrage-card shimmer rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-md animate-pulse"
          >
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // 🔍 Determina si mostrar loader o mensaje vacío
  const isLoading = status === "connecting" || (status === "open" && arbitrages.length === 0);

  return (
    <>
      {isSidebarOpen && (
        <div
          className="backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

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
            <h2 className="panel-title">
              Oportunidades de Arbitraje{" "}
              {selectedSport !== "All" ? `en ${currentSportName}` : ""}
            </h2>

            {isLoading && (
              <div className="text-center text-gray-400 mt-10">
                <LoadingCard />
                <p className="mt-6 text-sm opacity-70">
                  Cargando arbitrajes en tiempo real...
                </p>
              </div>
            )}

            {!isLoading && !hasArbitrages && (
              <p className="no-arbs-message">
                No hay oportunidades de arbitraje disponibles{" "}
                {selectedSport !== "All"
                  ? `para ${currentSportName}.`
                  : "en este momento."}
              </p>
            )}

            {Object.entries(grouped).map(([match, arbs]) => (
              <div key={match} className="match-container">
                <div className="match-header fade-in">
                  <h3>
                    {arbs[0].home_team} vs {arbs[0].away_team}
                  </h3>
                  <p>
                    {arbs[0].sport} | {arbs[0].match_date}
                  </p>
                </div>

                <div className="arb-list-container">
                  {arbs.map((arb) => {
                    const stakes = calculateStakes(arb);
                    return (
                      <ArbitrageCard
                        key={arb.id_arb}
                        arb={arb}
                        stakes={stakes}
                        deltaState={
                          lastDelta?.new?.includes(arb.id_arb)
                            ? "new"
                            : lastDelta?.updated?.includes(arb.id_arb)
                            ? "updated"
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showOverlay && status === "connecting" && (
        <div className={`loading-overlay ${fadeClass}`}>
          <h2 style={{ color: "var(--color-text-accent)", marginBottom: "1.5rem" }}>
            Cargando arbitrajes...
          </h2>
        </div>
      )}
    </>
  );
}
