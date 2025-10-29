import React from "react";
import BetInfo from "./BetInfo";
import ProfitBadge from "../ui/ProfitBadge";
import NewBadge from "../ui/NewBadge";
import { isRecent } from "../../utils/helpers";
import { Arbitrage, StakeResult } from "../../utils/types";

type ArbitrageCardProps = {
  arb: Arbitrage;
  stakes: StakeResult;
  deltaState?: "new" | "updated" | undefined; // 👈 Nuevo prop
};

const ArbitrageCard = ({ arb, stakes, deltaState }: ArbitrageCardProps) => {
  const isArbRecent = isRecent(arb.date_obtained, 1);

  // 🌀 Define clases dinámicas según el estado del delta
  const deltaClass =
    deltaState === "new"
      ? "highlight-new slide-in-bounce"
      : deltaState === "updated"
      ? "highlight-updated pulse-fade"
      : "";

  return (
    <div
      className={`arb-card fade-in ${deltaClass}`}
      role="article"
      aria-label={`Arbitraje ${arb.id_arb}`}
    >
      <div className="arb-card-header">
        <div className="arb-left">
          <ProfitBadge profit={arb.profit_percent} />
          {isArbRecent && <NewBadge />}
        </div>
        <div className="arb-date">{arb.date_obtained}</div>
      </div>

      <div className="arb-grid" style={{ marginTop: "0.6rem" }}>
        {arb.type === "Back vs Lay" ? (
          <>
            <BetInfo
              type="Back"
              player={arb.player}
              bookmaker={arb.back_bookmaker}
              odds={arb.back_odds}
              stake={stakes.stakeBack}
            />
            <BetInfo
              type="Lay"
              player={arb.player}
              bookmaker={arb.lay_bookmaker}
              odds={arb.lay_odds}
              stake={stakes.stakeLay}
              liability={stakes.liabilityLay}
            />
          </>
        ) : (
          <>
            <BetInfo
              type="Back"
              team={`Home: ${arb.home?.team}`}
              bookmaker={arb.home?.bookmaker}
              odds={arb.home?.odds}
              stake={stakes.stakeHome}
            />
            <BetInfo
              type="Back"
              team={`Away: ${arb.away?.team}`}
              bookmaker={arb.away?.bookmaker}
              odds={arb.away?.odds}
              stake={stakes.stakeAway}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ArbitrageCard;
