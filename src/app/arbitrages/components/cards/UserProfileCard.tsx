"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Globe2, Mail } from "lucide-react";
import LanguageSelector from "../../../components/LanguageSelector";
import { useLanguage } from "../../../context/LanguageProvider";
import { supabase } from "../../../components/supabaseClient";

type UserProfile = {
  email?: string | null;
  region?: string | null;
  betting_region?: string | null;
  language?: string | null;
};

type UserProfileCardProps = {
  user?: UserProfile | null;
};

type StatusState = "idle" | "saving" | "success" | "error";

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const { t } = useLanguage();
  const initialRegion = user?.betting_region || user?.region || "";
  const [region, setRegion] = useState<string>(initialRegion);
  const [status, setStatus] = useState<StatusState>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    setRegion(user?.betting_region || user?.region || "");
  }, [user?.betting_region, user?.region]);

  const regionOptions = useMemo(
    () => [
      { value: "EU", label: t("common.regions.eu") as string },
      { value: "UK", label: t("common.regions.uk") as string },
    ],
    [t]
  );

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setStatus("saving");
      setStatusMessage(t("arbitrage.profile.saving") as string);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session?.user?.id) {
        setStatus("error");
        setStatusMessage(t("arbitrage.profile.error") as string);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("auth_user_id", session.user.id);

      if (error) {
        throw error;
      }

      setStatus("success");
      setStatusMessage(t("arbitrage.profile.saved") as string);
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.warn("⚠️ Unable to update profile preferences:", err);
      setStatus("error");
      setStatusMessage(t("arbitrage.profile.error") as string);
    }
  };

  const handleRegionChange = async (value: string) => {
    setRegion(value);
    await updateProfile({ betting_region: value });
  };

  const handleLanguageFeedback = async () => {
    setStatus("success");
    setStatusMessage(t("arbitrage.profile.saved") as string);
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <section className="profile-card" aria-labelledby="profile-card-title">
      <header className="profile-card__header">
        <div>
          <h2 id="profile-card-title" className="profile-card__title">
            {t("arbitrage.profile.title") as string}
          </h2>
          <p className="profile-card__description">
            {t("arbitrage.profile.regionDescription") as string}
          </p>
        </div>
        {status !== "idle" && (
          <div
            className={`profile-card__status ${
              status === "success"
                ? "profile-card__status--success"
                : status === "error"
                ? "profile-card__status--error"
                : "profile-card__status--saving"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : status === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            <span>{statusMessage}</span>
          </div>
        )}
      </header>

      <div className="profile-card__body">
        <div className="profile-field">
          <span className="profile-field__label">
            <Mail className="h-4 w-4" aria-hidden />
            {t("arbitrage.profile.emailLabel") as string}
          </span>
          <span className="profile-field__value">{user?.email || "—"}</span>
        </div>

        <div className="profile-preferences">
          <LanguageSelector variant="card" onLanguageChange={handleLanguageFeedback} />

          <div className="profile-input">
            <label className="profile-input__label">
              <Globe2 className="h-4 w-4" aria-hidden />
              {t("arbitrage.profile.regionLabel") as string}
            </label>
            <select
              className="profile-input__control"
              value={region}
              onChange={(event) => handleRegionChange(event.target.value)}
              required
            >
              <option value="" disabled>
                {t("auth.regionLabel") as string}
              </option>
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileCard;

