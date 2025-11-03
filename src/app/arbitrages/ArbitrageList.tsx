"use client";

import React, { useState, useMemo, useCallback } from "react";

// 🧠 Hooks
import useArbitrageWS from "./hooks/useArbitrageWS";
import {
  calculateBackVsBackStakes,
  calculateBackVsLayStakes,
} from "./hooks/useStakes";

// ⚙️ Utilidades
import { SPORT_FILTERS } from "./utils/constants";

// 🧩 Componentes
import AppHeader from "./components/layout/AppHeader";
import SportFilter from "./components/layout/SportFilter";
import BankControl from "./components/ui/BankControl";
import ArbitrageCard from "./components/cards/ArbitrageCard";
import UserProfileCard from "./components/cards/UserProfileCard";
import { useLanguage } from "../context/LanguageProvider";
import type { Arbitrage } from "./utils/types";

import "./style.css";

type ArbitrageListProps = {
  user?: {
    email?: string | null;
    region?: string | null;
    betting_region?: string | null;
    language?: string | null;
  } | null;
};

export default function ArbitrageList({ user }: ArbitrageListProps) {
  const { arbitrages } = useArbitrageWS() as { arbitrages: Arbitrage[] };
  const { t } = useLanguage();

  const [bank, setBank] = useState<number>(100);
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🧮 Cálculo de stakes adaptado a tus datos reales
  const calculateStakes = useCallback(
    (arb) => {
      if (arb.type === "Back vs Lay") {
        const { stake1, stake2, liability2 } = calculateBackVsLayStakes(
          bank,
          arb.back_odds || 0,
          arb.lay_odds || 0
        );
        return { stakeBack: stake1, stakeLay: stake2, liabilityLay: liability2 };
      }
      if (arb.type === "Back vs Back") {
        const { stake1, stake2 } = calculateBackVsBackStakes(
          bank,
          arb.back_odds || 0,
          arb.lay_odds || 0
        );
        return { stakeHome: stake1, stakeAway: stake2 };
      }
      return {};
    },
    [bank]
  );

  // 🧩 Filtrado por deporte
  const filteredArbitrages = useMemo<Arbitrage[]>(() => {
    if (selectedSport === "All") return arbitrages;
    const sportKey = selectedSport.toLowerCase();
    return arbitrages.filter((arb) =>
      arb.sport_key?.toLowerCase().includes(sportKey)
    );
  }, [arbitrages, selectedSport]);

  // 🔗 Agrupación por partido
  const grouped = useMemo<Record<string, Arbitrage[]>>(() => {
    return filteredArbitrages.reduce<Record<string, Arbitrage[]>>((acc, arb) => {
      const key = `${arb.home_team} vs ${arb.away_team} @ ${arb.match_date}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(arb);
      return acc;
    }, {});
  }, [filteredArbitrages]);

  const hasArbitrages = filteredArbitrages.length > 0;
  const currentSportLabelKey =
    SPORT_FILTERS.find((f) => f.key === selectedSport)?.nameKey || "arbitrage.sports.All";
  const currentSportName = t(currentSportLabelKey) as string;

  return (
    <>
      <AppHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

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
          <UserProfileCard user={user} />
          <BankControl bank={bank} setBank={setBank} />

          <div className="arbitrage-panel">
            <h2 className="panel-title">
              {selectedSport !== "All"
                ? (t("arbitrage.panel.titleWithSport", { sport: currentSportName }) as string)
                : (t("arbitrage.panel.title") as string)}
            </h2>

            {!hasArbitrages && (
              <p className="no-arbs-message">
                {selectedSport !== "All"
                  ? (t("arbitrage.panel.emptySport", { sport: currentSportName }) as string)
                  : (t("arbitrage.panel.emptyAll") as string)}
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
                      />
                    );
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
