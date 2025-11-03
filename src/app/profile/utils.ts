import type { LanguageCode } from "@/lib/i18n/language";
import { getTranslations } from "@/lib/i18n";
import { PLAN_ALIASES } from "./constants";
import type { PlanObject, ProfileUser } from "./types";

const capitalizeWords = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const ENGLISH_PLAN_LIBRARY = getTranslations("en").profile.planLibrary;

export const normalizePlanName = (plan: ProfileUser["plan"]): string => {
  if (!plan) return "Free";

  const rawValue =
    typeof plan === "string" ? plan : plan.name || plan.tier || plan.slug || "Free";

  const normalized = PLAN_ALIASES[rawValue.toLowerCase()] ?? capitalizeWords(rawValue);
  return ENGLISH_PLAN_LIBRARY[normalized] ? normalized : "Free";
};

export const resolveRenewalDate = (plan: PlanObject | undefined, language: LanguageCode) => {
  if (!plan) return undefined;
  const renewalCandidate = plan.renewsAt ?? plan.renews_at ?? plan.renews_on;
  if (!renewalCandidate) return undefined;

  const renewalDate = new Date(renewalCandidate);
  if (Number.isNaN(renewalDate.getTime())) {
    return undefined;
  }

  const locale = language === "es" ? "es-ES" : "en-GB";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(renewalDate);
};
