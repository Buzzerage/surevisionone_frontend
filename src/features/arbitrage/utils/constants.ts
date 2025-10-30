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

// Lista de deportes con claves en inglés (minúsculas) para el filtrado
export const BASE_SPORT_FILTERS: SportFilterOption[] = [
  {
    name: "Todos",
    icon: MdList,
    key: ALL_SPORT_FILTER_KEY,
    matcher: () => true,
  },
  {
    name: "Fútbol",
    icon: MdSportsSoccer,
    key: "football",
    matcher: createMatcher(["football", "soccer"]),
  },
  {
    name: "Baloncesto",
    icon: MdSportsBasketball,
    key: "basketball",
    matcher: createMatcher(["basketball"]),
  },
  {
    name: "Tenis",
    icon: MdSportsTennis,
    key: "tennis",
    matcher: createMatcher(["tennis"]),
  },
  {
    name: "Voleibol",
    icon: MdSportsVolleyball,
    key: "volleyball",
    matcher: createMatcher(["volleyball"]),
  },
  {
    name: "Hockey",
    icon: MdSportsHockey,
    key: "hockey",
    matcher: createMatcher(["hockey"]),
  },
  {
    name: "Béisbol",
    icon: MdSportsBaseball,
    key: "baseball",
    matcher: createMatcher(["baseball"]),
  },
  {
    name: "Rugby",
    icon: MdSports,
    key: "rugby",
    matcher: createMatcher(["rugby"]),
  },
];

const fallbackLabel = (value: string) => {
  if (!value) return "Otros";
  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

export const buildDynamicSportFilter = (
  key: string,
  name: string
): SportFilterOption => ({
  key,
  name: name || fallbackLabel(key),
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
  sportName?: string | null
): SportFilterOption => {
  const match = BASE_SPORT_FILTERS.find(
    (filter) =>
      filter.key !== ALL_SPORT_FILTER_KEY && filter.matcher(sportKey, sportName)
  );

  if (match) {
    return match;
  }

  const normalizedKey = (sportKey || sportName || "otros")
    .toLowerCase()
    .replace(/\s+/g, "-");
  const label = sportName?.trim() || fallbackLabel(normalizedKey);
  return buildDynamicSportFilter(normalizedKey, label);
};