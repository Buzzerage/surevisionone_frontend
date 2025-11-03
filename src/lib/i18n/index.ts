import { useMemo } from "react";

import type { LanguageCode } from "./language";
import { LANGUAGE_FLAG_ASSETS, SUPPORTED_LANGUAGES } from "./language";
import { translations } from "./translations";
import type { AppTranslations } from "./translations";
import { useLanguageContext } from "@/providers/LanguageProvider";

export type TranslationNamespace = keyof AppTranslations;

export const getTranslations = (language: LanguageCode): AppTranslations => translations[language];

export const getLanguageNames = (language: LanguageCode) => translations[language].languageNames;

export const getLanguageOptions = (language: LanguageCode) => {
  const names = getLanguageNames(language);
  return SUPPORTED_LANGUAGES.map((code) => ({
    code,
    flagIcon: LANGUAGE_FLAG_ASSETS[code].src,
    flagAlt: LANGUAGE_FLAG_ASSETS[code].alt,
    label: names[code],
    codeLabel: code.toUpperCase(),
  }));
};

export function useAppTranslations(): AppTranslations;
export function useAppTranslations<N extends TranslationNamespace>(namespace: N): AppTranslations[N];
export function useAppTranslations(namespace?: TranslationNamespace) {
  const { language } = useLanguageContext();
  return useMemo(() => {
    const dictionary = translations[language];
    if (!namespace) {
      return dictionary;
    }
    return dictionary[namespace];
  }, [language, namespace]);
}
