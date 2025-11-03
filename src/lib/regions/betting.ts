export type BettingRegion = "EU" | "UK";

export const BETTING_REGION_OPTIONS: BettingRegion[] = ["EU", "UK"];

export const BETTING_REGION_FLAG_ASSETS: Record<
  BettingRegion,
  { src: string; alt: string }
> = {
  EU: {
    src: "/flags/eu.svg",
    alt: "European Union flag",
  },
  UK: {
    src: "/flags/uk.svg",
    alt: "United Kingdom flag",
  },
} as const;
