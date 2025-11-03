"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, Loader, CheckCircle, Globe2 } from "lucide-react";
import { useLanguage } from "../context/LanguageProvider";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginModal({ onClose, onAuthSuccess }) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authSucceeded, setAuthSucceeded] = useState(false);
  const [mode, setMode] = useState("login");

  const isRegisterMode = mode === "register";
  const isTransitioning = loading || authSucceeded;

  const regionOptions = useMemo(
    () => [
      { value: "EU", label: t("common.regions.eu") as string },
      { value: "UK", label: t("common.regions.uk") as string },
    ],
    [t]
  );

  const switchMode = () => {
    setMode(isRegisterMode ? "login" : "register");
    setAuthSucceeded(false);
    setLoading(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!BACKEND_URL) {
      setError("Missing NEXT_PUBLIC_API_URL configuration.");
      return;
    }

    if (!email || !password || (isRegisterMode && !confirmPassword)) {
      setError(t("auth.requiredFields") as string);
      return;
    }

    if (isRegisterMode && password !== confirmPassword) {
      setError(t("auth.passwordMismatch") as string);
      return;
    }

    if (isRegisterMode && !region) {
      setError(t("auth.regionRequired") as string);
      return;
    }

    setLoading(true);

    const endpoint = isRegisterMode ? "/auth/register" : "/auth/login";
    const payload: Record<string, unknown> = { email, password };
    if (isRegisterMode) {
      payload.region = region;
      payload.language = language;
    }

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response
        .clone()
        .json()
        .catch(() => null);

      if (!response.ok) {
        const message = (data && (data.detail || data.message)) || t("common.error");
        throw new Error(message as string);
      }

      setAuthSucceeded(true);

      if (isRegisterMode) {
        setTimeout(() => {
          setMode("login");
          setAuthSucceeded(false);
          setLoading(false);
          setError("");
        }, 1500);
      } else {
        setTimeout(() => {
          onClose?.();
          onAuthSuccess?.(data);
          router.push("/arbitrages");
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Auth error:", err);
      setError(err.message || (t("common.error") as string));
      setAuthSucceeded(false);
    } finally {
      if (!isRegisterMode) {
        setLoading(false);
      }
      if (isRegisterMode) {
        setTimeout(() => setLoading(false), 1600);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={isTransitioning ? (event) => event.stopPropagation() : onClose}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-2xl relative"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors ${
            isTransitioning ? "opacity-0 pointer-events-none" : ""
          }`}
          disabled={isTransitioning}
        >
          <X className="w-6 h-6" />
        </button>

        {isTransitioning ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            {authSucceeded ? (
              <CheckCircle className="w-16 h-16 text-green-500 animate-in fade-in zoom-in" />
            ) : (
              <Loader className="w-16 h-16 text-blue-500 animate-spin" />
            )}
            <h3 className="mt-4 text-lg text-[var(--color-text-accent)]">
              {authSucceeded
                ? (isRegisterMode
                    ? (t("auth.successRegister") as string)
                    : (t("auth.successLogin") as string))
                : (isRegisterMode
                    ? (t("auth.registering") as string)
                    : (t("auth.validating") as string))}
            </h3>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-2 text-[var(--color-text-accent)]">
              {isRegisterMode ? (t("auth.titleRegister") as string) : (t("auth.titleLogin") as string)}
            </h2>
            <p className="text-center text-sm text-[var(--color-text-secondary)] mb-6">
              {isRegisterMode
                ? (t("auth.regionHint") as string)
                : `${t("landing.nav.login") as string}`}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder={t("auth.emailPlaceholder") as string}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder={t("auth.passwordPlaceholder") as string}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
                  required
                />
              </div>

              {isRegisterMode && (
                <>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder={t("auth.confirmPasswordPlaceholder") as string}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={region}
                      onChange={(event) => setRegion(event.target.value)}
                      className="w-full appearance-none pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
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
                </>
              )}

              {error && (
                <p className="text-center text-red-500 bg-red-100 rounded-lg py-2 px-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 text-white rounded-lg bg-[var(--color-accent-primary)] hover:bg-[#0ea5e9] transition-colors font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-5 h-5 mx-auto animate-spin" />
                ) : isRegisterMode ? (
                  t("auth.submitRegister") as string
                ) : (
                  t("auth.submitLogin") as string
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
              <button
                type="button"
                onClick={switchMode}
                className="font-medium text-[var(--color-accent-primary)] hover:underline"
              >
                {isRegisterMode ? (t("auth.toggleToLogin") as string) : (t("auth.toggleToRegister") as string)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

