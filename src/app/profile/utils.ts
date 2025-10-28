import { PLAN_ALIASES, PLAN_LIBRARY } from "./constants";
import type { PlanObject, ProfileUser } from "./types";

const capitalizeWords = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const normalizePlanName = (plan: ProfileUser["plan"]): string => {
  if (!plan) return "Free";

  const rawValue =
    typeof plan === "string" ? plan : plan.name || plan.tier || plan.slug || "Free";

  const normalized = PLAN_ALIASES[rawValue.toLowerCase()] ?? capitalizeWords(rawValue);
  return PLAN_LIBRARY[normalized] ? normalized : "Free";
};

export const resolveRenewalDate = (plan: PlanObject | undefined) => {
  if (!plan) return undefined;
  const renewalCandidate = plan.renewsAt ?? plan.renews_at ?? plan.renews_on;
  if (!renewalCandidate) return undefined;

  const renewalDate = new Date(renewalCandidate);
  if (Number.isNaN(renewalDate.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(renewalDate);
};