import type { PlanMetadata } from "./types";
import type { LanguageCode } from "@/lib/i18n/language";
import { getTranslations } from "@/lib/i18n";

export const PLAN_ALIASES: Record<string, string> = {
  free: "Free",
  gratis: "Free",
  starter: "Starter",
  basic: "Starter",
  pro: "Pro",
  profesional: "Pro",
  ultimate: "Ultimate",
  enterprise: "Ultimate",
};

export const getPlanLibrary = (language: LanguageCode): Record<string, PlanMetadata> =>
  getTranslations(language).profile.planLibrary;
