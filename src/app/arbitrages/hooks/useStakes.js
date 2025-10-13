// utils/stakeCalculators.js

export function calculateBackVsBackStakes(bank, C1, C2) {
    const inv1 = 1 / C1;
    const inv2 = 1 / C2;
    const arbPercentage = inv1 + inv2;

    const stake1 = (bank * inv1) / arbPercentage;
    const stake2 = (bank * inv2) / arbPercentage;

    return {
        stake1: stake1.toFixed(2),
        stake2: stake2.toFixed(2),
        // No se devuelven liability2 ni netProfit
    };
}

// -------------------------------------------------------------

export function calculateBackVsLayStakes(bank, backOdds, layOdds) {
    const layMinusOne = layOdds - 1;

    // Cálculo de proporciones basado en la distribución de la inversión (Stake Back + Liability Lay)
    const probBack = 1 / backOdds;
    const probLayLiability = layMinusOne / layOdds;
    const arbPercentage = probBack + probLayLiability;

    const stakeBack = (bank * probBack) / arbPercentage;
    const liabilityLay = (bank * probLayLiability) / arbPercentage;
    const stakeLay = liabilityLay / layMinusOne;

    return {
        stake1: stakeBack.toFixed(2),        // Stake en la casa Back
        stake2: stakeLay.toFixed(2),         // Stake real a colocar en Lay
        liability2: liabilityLay.toFixed(2),   // Riesgo máximo en Lay
        // No se devuelve netProfit
    };
}