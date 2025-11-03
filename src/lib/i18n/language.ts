export type LanguageCode = "en" | "es";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const SUPPORTED_LANGUAGES: LanguageCode[] = ["en", "es"];

export const LANGUAGE_FLAG_ASSETS: Record<
  LanguageCode,
  { src: string; alt: string }
> = {
  en: {
    src: "/flags/uk.svg",
    alt: "United Kingdom flag",
  },
  es: {
    src: "/flags/es.svg",
    alt: "Bandera de España",
  },
} as const;
