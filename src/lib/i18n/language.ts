export type LanguageCode = "en" | "es";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const SUPPORTED_LANGUAGES: LanguageCode[] = ["en", "es"];

export const LANGUAGE_FLAGS: Record<LanguageCode, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
} as const;
