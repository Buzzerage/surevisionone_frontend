// src/utils/types.ts

// Definiciones de tipos para Arbitrage
export type Arbitrage = {
    id_arb: string;
    profit_percent: number;
    date_obtained: string;
    type: "Back vs Lay" | "Back vs Back";
    
    // --- PROPIEDADES DE DEPORTE (NUEVA PROPIEDAD 'sport') ---
    sport: string;          // ⬅️ AÑADIDO: Nombre del evento/liga (ej: "ATP Shanghai Masters")
    sport_key: string;      // Clave en minúsculas para el filtrado (ej: "tennis_...")

    // --- PROPIEDADES DE CUOTAS Y BOOKMAKERS ---
    player?: string;
    back_bookmaker?: string;
    back_odds?: number;
    lay_bookmaker?: string;
    lay_odds?: number;

    // Propiedades para Back vs Back (Home/Away)
    home?: { team: string; bookmaker: string; odds: number };
    away?: { team: string; bookmaker: string; odds: number };
    
    // Propiedades de la estructura del partido
    home_team: string;
    away_team: string;
    match_date: string;
};

// Definición de tipos para los stakes calculados
export type StakeResult = {
    stakeBack?: number;
    stakeLay?: number;
    liabilityLay?: number;
    stakeHome?: number;
    stakeAway?: number;
};
// Definición de tipos para los stakes calculados
export type StakeResult = {
    stakeBack?: number;
    stakeLay?: number;
    liabilityLay?: number;
    stakeHome?: number;
    stakeAway?: number;
};