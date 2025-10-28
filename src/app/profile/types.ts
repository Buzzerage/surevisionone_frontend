export type PlanQuota = {
  opportunitiesPerDay?: number;
  alerts?: number;
  refreshIntervalMinutes?: number;
  refresh_interval_minutes?: number;
};

export type PlanObject = {
  name?: string;
  tier?: string;
  slug?: string;
  status?: string;
  state?: string;
  renewsAt?: string;
  renews_at?: string;
  renews_on?: string;
  quota?: PlanQuota;
  limits?: PlanQuota;
};

export type ProfileUser = {
  email?: string;
  full_name?: string;
  name?: string;
  plan?: string | PlanObject;
};

export type FeedbackTone = "success" | "info" | "warning" | "error";

export type FeedbackState = {
  type: FeedbackTone;
  message: string;
};

export type PlanMetadata = {
  description: string;
  features: string[];
  cta: string;
};