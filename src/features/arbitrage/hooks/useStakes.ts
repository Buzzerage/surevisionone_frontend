import type { StakeResult } from "../utils/types";

export function calculateBackVsBackStakes(bank: number, homeOdds: number, awayOdds: number): StakeResult {
  if (!homeOdds || !awayOdds) {
    return { stakeHome: 0, stakeAway: 0 };
  }

  const invHome = 1 / homeOdds;
  const invAway = 1 / awayOdds;
  const arbPercentage = invHome + invAway;

  const stake1 = (bank * invHome) / arbPercentage;
  const stake2 = (bank * invAway) / arbPercentage;

  return {
    stakeHome: Number(stake1.toFixed(2)),
    stakeAway: Number(stake2.toFixed(2)),
  };
}

export function calculateBackVsLayStakes(bank: number, backOdds: number, layOdds: number): StakeResult {
  if (!backOdds || !layOdds || layOdds <= 1) {
    return { stakeBack: 0, stakeLay: 0, liabilityLay: 0 };
  }

  const layMinusOne = layOdds - 1;
  const probBack = 1 / backOdds;
  const probLayLiability = layMinusOne / layOdds;
  const arbPercentage = probBack + probLayLiability;

  const stakeBack = (bank * probBack) / arbPercentage;
  const liabilityLay = (bank * probLayLiability) / arbPercentage;
  const stakeLay = liabilityLay / layMinusOne;

  return {
    stakeBack: Number(stakeBack.toFixed(2)),
    stakeLay: Number(stakeLay.toFixed(2)),
    liabilityLay: Number(liabilityLay.toFixed(2)),
  };
}