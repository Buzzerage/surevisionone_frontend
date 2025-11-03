// src/utils/constants.ts
import type { IconType } from "react-icons";
import {
  MdSportsSoccer,
  MdSportsBasketball,
  MdSportsVolleyball,
  MdSportsHockey,
  MdList,
  MdSportsBaseball,
  MdSportsTennis,
  MdSports,
} from "react-icons/md";

import type { LanguageCode } from "@/lib/i18n/language";
import { getTranslations } from "@/lib/i18n";
import type { AppTranslations } from "@/lib/i18n/translations";

type SportMatcher = (sportKey?: string | null, sportName?: string | null) => boolean;

export type SportFilterOption = {
  key: string;
  name: string;
  icon: IconType;
  matcher: SportMatcher;
};

const createMatcher = (aliases: string[]): SportMatcher => {
  const normalized = aliases.map((alias) => alias.toLowerCase());
  return (sportKey?: string | null, sportName?: string | null) => {
    const keyValue = sportKey?.toLowerCase() ?? "";
    const nameValue = sportName?.toLowerCase() ?? "";
    return normalized.some(
      (alias) => alias && (keyValue.includes(alias) || nameValue.includes(alias))
    );
  };
};

export const ALL_SPORT_FILTER_KEY = "All";

type SportLabelKey = keyof AppTranslations["arbitrage"]["sports"];

type SportDefinition = {
  key: string;
  icon: IconType;
  aliases?: string[];
  translationKey: SportLabelKey;
};

const SPORT_DEFINITIONS: SportDefinition[] = [
  {
    key: ALL_SPORT_FILTER_KEY,
    icon: MdList,
    translationKey: "all",
  },
  {
    key: "football",
    icon: MdSportsSoccer,
    aliases: ["football", "soccer"],
    translationKey: "football",
  },
  {
    key: "basketball",
    icon: MdSportsBasketball,
    aliases: ["basketball"],
    translationKey: "basketball",
  },
  {
    key: "tennis",
    icon: MdSportsTennis,
    aliases: ["tennis"],
    translationKey: "tennis",
  },
  {
    key: "volleyball",
    icon: MdSportsVolleyball,
    aliases: ["volleyball"],
    translationKey: "volleyball",
  },
  {
    key: "hockey",
    icon: MdSportsHockey,
    aliases: ["hockey"],
    translationKey: "hockey",
  },
  {
    key: "baseball",
    icon: MdSportsBaseball,
    aliases: ["baseball"],
    translationKey: "baseball",
  },
  {
    key: "rugby",
    icon: MdSports,
    aliases: ["rugby"],
    translationKey: "rugby",
  },
];

const fallbackLabel = (value: string, language: LanguageCode) => {
  const labels = getTranslations(language).arbitrage.sports;
  const base = value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

  if (!base) {
    return labels.other;
  }

  return base;
};

export const getBaseSportFilters = (
  language: LanguageCode
): SportFilterOption[] => {
  const labels = getTranslations(language).arbitrage.sports;
  return SPORT_DEFINITIONS.map((definition) => ({
    key: definition.key,
    icon: definition.icon,
    name: labels[definition.translationKey],
    matcher:
      definition.key === ALL_SPORT_FILTER_KEY
        ? () => true
        : createMatcher(definition.aliases ?? []),
  }));
};

export const buildDynamicSportFilter = (
  key: string,
  name: string,
  language: LanguageCode
): SportFilterOption => ({
  key,
  name: name || fallbackLabel(key, language),
  icon: MdSports,
  matcher: (sportKey?: string | null, sportName?: string | null) => {
    const normalizedKey = key.toLowerCase();
    const valueKey = sportKey?.toLowerCase() ?? "";
    const valueName = sportName?.toLowerCase() ?? "";
    return (
      normalizedKey.length > 0 &&
      (valueKey.includes(normalizedKey) || valueName.includes(normalizedKey))
    );
  },
});

export const resolveSportFilterOption = (
  sportKey?: string | null,
  sportName?: string | null,
  language: LanguageCode = "es"
): SportFilterOption => {
  const baseFilters = getBaseSportFilters(language);
  const match = baseFilters.find(
    (filter) =>
      filter.key !== ALL_SPORT_FILTER_KEY && filter.matcher(sportKey, sportName)
  );

  if (match) {
    return match;
  }

  const normalizedKey = (sportKey || sportName || "otros")
    .toLowerCase()
    .replace(/\s+/g, "-");
  const label = sportName?.trim() || fallbackLabel(normalizedKey, language);
  return buildDynamicSportFilter(normalizedKey, label, language);
};
