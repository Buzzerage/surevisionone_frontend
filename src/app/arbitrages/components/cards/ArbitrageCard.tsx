// src/components/cards/ArbitrageCard.tsx

import React, { useState, useEffect } from "react"; // ⬅️ Importaciones CLAVE
import BetInfo from "./BetInfo";
import ProfitBadge from "../ui/ProfitBadge";
import NewBadge from "../ui/NewBadge";
import { isRecent } from "../../utils/helpers";
import { Arbitrage, StakeResult } from "../../utils/types";

type ArbitrageCardProps = {
    arb: Arbitrage;
    stakes: StakeResult;
};

const ArbitrageCard = ({ arb, stakes }: ArbitrageCardProps) => {
    // 1. Estado para forzar la re-renderización periódica y actualizar el tiempo
    const [currentTime, setCurrentTime] = useState(Date.now());
    
    // 2. Efecto para establecer un temporizador
    useEffect(() => {
        // Actualiza el estado currentTime cada 1000ms (1 segundo)
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        // Función de limpieza: detiene el temporizador cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, []); 

    // 3. Lógica de "Nuevo" que se recalcula en cada renderizado
    // El '5' indica que un arbitraje es nuevo por 5 minutos
    const isArbRecent = isRecent(arb.date_obtained, 5);
    
    return (
        <div className="arb-card fade-in" role="article" aria-label={`Arbitraje ${arb.id_arb}`}>
            <div className="arb-card-header">
                <div className="arb-left">
                    <ProfitBadge profit={arb.profit_percent} />
                    
                    {/* El badge se muestra si isArbRecent es true y desaparecerá automáticamente */}
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