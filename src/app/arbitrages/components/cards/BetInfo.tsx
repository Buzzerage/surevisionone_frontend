// src/components/cards/BetInfo.tsx
"use client";
import React from "react";
import { useLanguage } from "../../../context/LanguageProvider";

type BetInfoProps = {
    type: string;
    player?: string;
    team?: string;
    bookmaker?: string;
    odds?: number | string;
    stake?: number | string;
    liability?: number | string;
};

const BetInfo = ({ type, player, team, bookmaker, odds, stake, liability }: BetInfoProps) => {
    const { t } = useLanguage();
    const normalizedType = type.toLowerCase();
    const backLabel = (t('arbitrage.bet.back') as string).toLowerCase();
    const isBack = normalizedType === "back" || normalizedType === backLabel;
    return (
        <div className={`bet-card ${isBack ? "bet-back" : "bet-lay"} fade-in`}>
            <div className="bet-header">
                <div className="bet-title-row">
                    <span className={`bet-icon ${isBack ? "bet-icon-back" : "bet-icon-lay"}`}>{isBack ? "↑" : "↓"}</span>
                    <h4 className="bet-title">{player || team}</h4>
                </div>
                <div className="bet-meta">
                    <span className="bet-odds">{(typeof odds === "number" ? odds : parseFloat(odds)).toFixed(2)}</span>
                    <span className={`type-tag ${isBack ? "type-back" : "type-lay"}`}>{type.toUpperCase()}</span>
                </div>
            </div>
            <div className="bet-footer">
                <span className="bookmaker-pill">{bookmaker}</span>
                <span className="muted">
                    <span className="stake-value">€</span> {t('arbitrage.bet.stake') as string}: <span className="stake-value">{stake}€</span>
                </span>
                {liability && (
                    <span className="muted">
                        <span className="liability-value">⚠</span> {t('arbitrage.bet.liability') as string}: <span className="liability-value">{liability}€</span>
                    </span>
                )}
            </div>
        </div>
    );
};

export default BetInfo;