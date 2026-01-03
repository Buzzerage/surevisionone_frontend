"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AlertTriangle, ArrowUpRight, Crown, Loader2, Mail, ShieldCheck, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/browser-client";
import ProfileCard from "./components/ProfileCard";
import PasswordForm, { type PasswordFormValues } from "./components/PasswordForm";
import StatusBanner from "./components/StatusBanner";
import { getPlanLibrary } from "./constants";
import { normalizePlanName, resolveRenewalDate } from "./utils";
import type { FeedbackState, PlanObject, ProfileUser } from "./types";
import LanguageSelectField from "@/components/ui/LanguageSelectField";
import { useLanguageContext } from "@/providers/LanguageProvider";
import type { LanguageCode } from "@/lib/i18n/language";
import { useAppTranslations } from "@/lib/i18n";
import {
  BETTING_REGION_FLAG_ASSETS,
  BETTING_REGION_OPTIONS,
  type BettingRegion,
} from "@/lib/regions/betting";
import { clearSupabaseSession } from "@/lib/supabase/clearSession";

const emptyForm: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const resolveLanguageFromMetadata = (value: unknown): LanguageCode | null => {
  if (value === "es") return "es";
  if (value === "en") return "en";
  return null;
};

const resolveRegionFromMetadata = (value: unknown): BettingRegion | null => {
  if (value === "UK") return "UK";
  if (value === "EU") return "EU";
  return null;
};

type ProfilePanelProps = {
  user: User;
};

const ProfilePanel = ({ user }: ProfilePanelProps) => {
  const router = useRouter();
  const { language, saveLanguagePreference } = useLanguageContext();
  const copy = useAppTranslations("profile");

  const [formValues, setFormValues] = useState<PasswordFormValues>(emptyForm);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const planSource = useMemo<ProfileUser["plan"]>(() => {
    if (!user) return undefined;

    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>;

    const subscription =
      typeof metadata.subscription === "object" && metadata.subscription !== null
        ? (metadata.subscription as Record<string, unknown>)
        : undefined;

    const directPlan = (user as unknown as ProfileUser)?.plan;

    return (
      (metadata.plan as ProfileUser["plan"]) ??
      (subscription?.plan as ProfileUser["plan"]) ??
      (appMetadata.plan as ProfileUser["plan"]) ??
      directPlan
    );
  }, [user]);

  const planObject = useMemo<PlanObject | undefined>(() => {
    if (planSource && typeof planSource === "object") {
      return planSource as PlanObject;
    }
    return undefined;
  }, [planSource]);

  const normalizedPlan = useMemo(() => normalizePlanName(planSource), [planSource]);
  const planLibrary = useMemo(() => getPlanLibrary(language), [language]);
  const planMetadata = planLibrary[normalizedPlan] ?? planLibrary.Free;
  const planStatus = planObject?.status ?? planObject?.state;
  const renewalDate = resolveRenewalDate(planObject, language);

  const quota = planObject?.quota ?? planObject?.limits;
  const opportunitiesPerDay = quota?.opportunitiesPerDay;
  const alertsPerDay = quota?.alerts;
  const refreshIntervalMinutes = quota?.refreshIntervalMinutes ?? quota?.refresh_interval_minutes;

  const userMetadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const metadataLanguage = resolveLanguageFromMetadata(userMetadata.language);
  const metadataRegion = resolveRegionFromMetadata(userMetadata.betting_region);
  const initialProfileLanguage = metadataLanguage ?? language;
  const initialProfileRegion = metadataRegion ?? "EU";
  const [profileLanguage, setProfileLanguage] = useState<LanguageCode>(initialProfileLanguage);
  const [draftLanguage, setDraftLanguage] = useState<LanguageCode>(language);
  const [profileRegion, setProfileRegion] = useState<BettingRegion>(initialProfileRegion);
  const [draftRegion, setDraftRegion] = useState<BettingRegion>(initialProfileRegion);
  const fullName =
    (userMetadata.full_name as string | undefined) ??
    (userMetadata.fullName as string | undefined) ??
    (userMetadata.name as string | undefined) ??
    (userMetadata.display_name as string | undefined) ??
    (userMetadata.displayName as string | undefined) ??
    (user as unknown as ProfileUser)?.full_name ??
    (user as unknown as ProfileUser)?.name;
  const userEmail = user?.email ?? undefined;
  const email = userEmail ?? "—";

  useEffect(() => {
    setProfileLanguage(initialProfileLanguage);
  }, [initialProfileLanguage]);

  useEffect(() => {
    setDraftLanguage(language);
  }, [language]);

  useEffect(() => {
    setProfileRegion(initialProfileRegion);
    setDraftRegion(initialProfileRegion);
  }, [initialProfileRegion]);

  const updateFormValue = (field: keyof PasswordFormValues, value: string) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleLanguageDraftChange = useCallback((code: LanguageCode) => {
    setDraftLanguage(code);
  }, []);

  const handleRegionSelect = useCallback((region: BettingRegion) => {
    setDraftRegion(region);
  }, []);

  const preferencesDirty = draftLanguage !== profileLanguage || draftRegion !== profileRegion;

  const handleSavePreferences = useCallback(async () => {
    setFeedback(null);
    setIsSavingPreferences(true);

    try {
      await saveLanguagePreference(draftLanguage, { betting_region: draftRegion });
      setProfileLanguage(draftLanguage);
      setProfileRegion(draftRegion);
      setFeedback({ type: "success", message: copy.feedback.preferencesSaved });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : copy.feedback.preferencesSaveFailed;
      setFeedback({ type: "error", message });
    } finally {
      setIsSavingPreferences(false);
    }
  }, [
    copy.feedback.preferencesSaveFailed,
    copy.feedback.preferencesSaved,
    draftLanguage,
    draftRegion,
    saveLanguagePreference,
  ]);

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!formValues.currentPassword || !formValues.newPassword) {
      setFeedback({
        type: "error",
        message: copy.feedback.passwordMissingFields,
      });
      return;
    }

    if (formValues.newPassword !== formValues.confirmPassword) {
      setFeedback({
        type: "error",
        message: copy.feedback.passwordMismatch,
      });
      return;
    }

    const newPassword = formValues.newPassword;
    const passwordMeetsRequirements =
      newPassword.length >= 12 &&
      /[a-z]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /\d/.test(newPassword);

    if (!passwordMeetsRequirements) {
      setFeedback({
        type: "error",
        message: copy.feedback.passwordRequirements,
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      if (!userEmail) {
        throw new Error(copy.feedback.passwordMissingEmail);
      }

      // 1️⃣ Reautenticar al usuario con la contraseña actual
      const { error: validationError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: formValues.currentPassword,
      });

      if (validationError) {
        const message =
          validationError.status === 400 || validationError.status === 401
            ? copy.feedback.passwordIncorrectCurrent
            : validationError.message || copy.feedback.passwordValidateFailed;
        throw new Error(message);
      }

      // 2️⃣ Actualizar la contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: formValues.newPassword,
      });

      if (updateError) {
        const message =
          updateError.status === 422
            ? copy.feedback.passwordInvalidNew
            : updateError.message || copy.feedback.passwordUpdateFailed;
        throw new Error(message);
      }

      // 3️⃣ Feedback de éxito y limpiar formulario
      setFeedback({
        type: "success",
        message: copy.feedback.passwordUpdated,
      });
      setFormValues(emptyForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : copy.feedback.passwordUpdateFailed;
      setFeedback({ type: "error", message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpgradePlan = () => {
    setFeedback({
      type: "info",
      message: copy.feedback.upgradeInfo,
    });
    if (typeof window !== "undefined") {
      window.open("/#pricing", "_blank", "noopener,noreferrer");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(copy.feedback.deleteConfirm);

    if (!confirmation) {
      return;
    }

    setIsDeletingAccount(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message || copy.feedback.deleteSessionCheck);
      }

      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        throw new Error(copy.feedback.deleteTokenMissing);
      }

      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: sessionData.session.user.id }),
      });

      const responseHasJson = response.headers
        .get("content-type")
        ?.toLowerCase()
        .includes("application/json");

      const payload = responseHasJson ? await response.json().catch(() => null) : null;

      if (!response.ok) {
        const errorMessage =
          payload &&
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string" &&
          payload.error.length > 0
            ? payload.error
            : copy.feedback.deleteFailed;
        throw new Error(errorMessage);
      }

      if (
        payload &&
        typeof payload === "object" &&
        payload !== null &&
        "success" in payload &&
        payload.success === false
      ) {
        const errorMessage =
          "error" in payload && typeof payload.error === "string" && payload.error.length > 0
            ? payload.error
            : copy.feedback.deleteFailed;
        throw new Error(errorMessage);
      }

      setFeedback({
        type: "success",
        message: copy.feedback.deleteSuccess,
      });
      setTimeout(async () => {
        try {
          await clearSupabaseSession();
        } catch (signOutError) {
          if (process.env.NODE_ENV !== "production") {
            console.error("Unable to clear the session after deleting the account", signOutError);
          }
        } finally {
          router.replace("/");
        }
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : copy.feedback.deleteFailed;
      setFeedback({ type: "error", message });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-transparent via[rgba(6,182,212,0.06)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/3 bg-[radial-gradient(circle_at_top,rgba(21,70,239,0.18),transparent_65%)] opacity-40 lg:block" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--card-bg-gradient-start),var(--card-bg-gradient-end))] px-6 py-6 shadow-[0_30px_60px_-35px_var(--color-card-glow)] backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/panel")}
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-accent)] transition-all hover:bg-[var(--color-hover-bg)] hover:scale-[1.03]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {copy.back}
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">
                {copy.headerBadge}
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-accent)] sm:text-4xl">
                {copy.headerTitle}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {copy.headerDescription}
              </p>
            </div>
          </div>
        </header>

        <StatusBanner
          feedback={feedback}
          onDismiss={() => setFeedback(null)}
          dismissLabel={copy.alertDismiss}
        />

        <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <ProfileCard
            icon={<Mail className="h-6 w-6" />}
            title={copy.mainCard.title}
            description={copy.mainCard.description}
          >
            <dl className="space-y-4 text-sm">
              {fullName ? (
                <div>
                  <dt className="text-[var(--color-text-secondary)]">{copy.mainCard.fullName}</dt>
                  <dd className="text-lg font-medium text-[var(--color-text-accent)]">{fullName}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-[var(--color-text-secondary)]">{copy.mainCard.email}</dt>
                <dd className="text-lg font-medium text-[var(--color-text-accent)]">{email}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-secondary)]">{copy.mainCard.language}</dt>
                <LanguageSelectField value={draftLanguage} onChange={handleLanguageDraftChange} />
              </div>
              <div>
                <dt className="text-[var(--color-text-secondary)]">{copy.mainCard.region}</dt>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {BETTING_REGION_OPTIONS.map((region) => {
                    const isActive = draftRegion === region;
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => handleRegionSelect(region)}
                        className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] ${
                          isActive
                            ? "border-[var(--color-accent-primary)] bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
                            : "border-[var(--color-border)] bg-[var(--color-background-secondary)]/60 text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)]"
                        }`}
                        aria-label={copy.mainCard.regionOptions[region]}
                      >
                        <span
                          className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-background-secondary)]"
                          aria-hidden="true"
                        >
                          <Image
                            src={BETTING_REGION_FLAG_ASSETS[region].src}
                            alt={BETTING_REGION_FLAG_ASSETS[region].alt}
                            width={48}
                            height={36}
                            className="h-10 w-14 object-cover"
                          />
                        </span>
                        <span>{region}</span>
                        <span
                          className="text-[var(--color-text-secondary)] normal-case"
                          aria-hidden="true"
                        >
                          {copy.mainCard.regionOptions[region]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <dt className="text-[var(--color-text-secondary)]">{copy.mainCard.activePlan}</dt>
                <dd className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background-tertiary)] px-3 py-1 text-sm font-semibold text-[var(--color-text-accent)]">
                  <Crown className="h-4 w-4 text-[var(--color-accent-primary)]" />
                  {normalizedPlan}
                </dd>
              </div>
              {planStatus ? (
                <div>
                  <dt className="text-[var(--color-text-secondary)]">{copy.mainCard.planStatus}</dt>
                  <dd className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent-primary)]">
                    {planStatus}
                  </dd>
                </div>
              ) : null}
              {renewalDate ? (
                <div>
                  <dt className="text-[var(--color-text-secondary)]">{copy.mainCard.renewal}</dt>
                  <dd className="text-sm font-medium text-[var(--color-text-accent)]">
                    {renewalDate}
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={!preferencesDirty || isSavingPreferences}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-primary)] transition hover:bg-[var(--color-accent-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingPreferences ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {copy.mainCard.savingPreferences}
                  </>
                ) : (
                  <>{copy.mainCard.savePreferences}</>
                )}
              </button>
            </div>
          </ProfileCard>

          <ProfileCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title={copy.securityCard.title}
            description={copy.securityCard.description}
          >
            <PasswordForm
              values={formValues}
              onChange={updateFormValue}
              onSubmit={handlePasswordSubmit}
              submitting={isUpdatingPassword}
              labels={copy.passwordForm}
            />
          </ProfileCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ProfileCard
            icon={<Crown className="h-6 w-6" />}
            title={`${copy.planCard.titlePrefix} ${normalizedPlan}${
              copy.planCard.titleSuffix ? ` ${copy.planCard.titleSuffix}` : ""
            }`.trim()}
            description={planMetadata.description}
          >
            <ul className="space-y-3 text-sm text-[var(--color-text-accent)]">
              {planMetadata.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[linear-gradient(135deg,var(--card-bg-gradient-start),var(--card-bg-gradient-end))] px-3 py-2 shadow-[0_18px_35px_-25px_var(--color-card-glow)]"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent-primary)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {(opportunitiesPerDay || alertsPerDay || refreshIntervalMinutes) && (
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                {opportunitiesPerDay ? (
                  <div>
                    <dt className="text-[var(--color-text-secondary)]">
                      {copy.planCard.opportunities}
                    </dt>
                    <dd className="font-medium text-[var(--color-text-accent)]">
                      {opportunitiesPerDay}
                    </dd>
                  </div>
                ) : null}
                {alertsPerDay ? (
                  <div>
                    <dt className="text-[var(--color-text-secondary)]">
                      {copy.planCard.alerts}
                    </dt>
                    <dd className="font-medium text-[var(--color-text-accent)]">
                      {alertsPerDay}
                    </dd>
                  </div>
                ) : null}
                {refreshIntervalMinutes ? (
                  <div>
                    <dt className="text-[var(--color-text-secondary)]">
                      {copy.planCard.refresh}
                    </dt>
                    <dd className="font-medium text-[var(--color-text-accent)]">
                      {copy.planCard.refreshEvery} {refreshIntervalMinutes}{" "}
                      {copy.planCard.refreshUnit}
                    </dd>
                  </div>
                ) : null}
              </dl>
            )}

            <button
              type="button"
              onClick={handleUpgradePlan}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-primary)] px-5 py-2 text-sm font-semibold text-[var(--color-accent-primary)] transition hover:bg-[var(--color-accent-primary)] hover:text-white"
            >
              {planMetadata.cta}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </ProfileCard>

          <ProfileCard
            icon={<AlertTriangle className="h-6 w-6" />}
            title={copy.dangerCard.title}
            description={copy.dangerCard.description}
            tone="danger"
          >
            <p className="mb-5 text-sm leading-relaxed text-[var(--color-danger-text)]">
              {copy.dangerCard.body}
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-danger-solid)] px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_45px_-25px_var(--color-card-glow)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {copy.dangerCard.processing}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  {copy.dangerCard.delete}
                </>
              )}
            </button>
          </ProfileCard>
        </section>
      </div>
    </div>
  );
};

export default ProfilePanel;
