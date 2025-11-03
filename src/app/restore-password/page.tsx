"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Lock } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { useAppTranslations } from "@/lib/i18n";

export default function RestorePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = useAppTranslations("auth");
  const restoreCopy = copy.restore;

  const [verificationState, setVerificationState] = useState<"verifying" | "ready">("verifying");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const extractCode = () => {
      const queryCode = searchParams.get("code");
      if (queryCode) return queryCode;

      if (typeof window === "undefined") {
        return null;
      }

      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      if (!hash) {
        return null;
      }
      const hashParams = new URLSearchParams(hash);
      return hashParams.get("code");
    };

    const code = extractCode();

    if (!code) {
      setVerificationState("ready");
      setError(restoreCopy.invalid);
      return;
    }

    const verify = async () => {
      setError(null);
      setVerificationState("verifying");
      try {
        await supabase.auth.exchangeCodeForSession({ type: "recovery", code });
        if (!active) return;
        setVerificationState("ready");
      } catch (verificationError) {
        if (!active) return;
        if (process.env.NODE_ENV !== "production") {
          console.warn("No se pudo verificar el enlace de recuperación", verificationError);
        }
        setError(restoreCopy.invalid);
        setVerificationState("ready");
      }
    };

    void verify();

    return () => {
      active = false;
    };
  }, [restoreCopy.invalid, searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (verificationState !== "ready" || success) {
      return;
    }

    if (password !== confirmPassword) {
      setError(restoreCopy.mismatch);
      return;
    }

    const meetsRequirements =
      password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

    if (!meetsRequirements) {
      setError(restoreCopy.requirements);
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        throw updateError;
      }

      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError && process.env.NODE_ENV !== "production") {
        console.warn("No se pudo refrescar la sesión después de restablecer la contraseña", refreshError);
      }

      setSuccess(restoreCopy.success);
      setTimeout(() => {
        router.push("/panel");
      }, 2000);
    } catch (submitError) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("No se pudo actualizar la contraseña", submitError);
      }
      const message =
        submitError instanceof Error && submitError.message
          ? submitError.message
          : restoreCopy.genericError;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-8 shadow-[0_40px_80px_-45px_var(--color-card-glow)]">
          <h1 className="text-2xl font-bold text-[var(--color-text-accent)]">{restoreCopy.title}</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{restoreCopy.subtitle}</p>

          {verificationState === "verifying" ? (
            <div className="mt-8 flex flex-col items-center gap-3 text-sm text-[var(--color-text-secondary)]">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent-primary)]" />
              <span>{restoreCopy.verifying}</span>
            </div>
          ) : success ? (
            <div className="mt-8 flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-[var(--color-accent-primary)]" />
              <p className="text-sm text-[var(--color-text-accent)]">{success}</p>
              <button
                type="button"
                onClick={() => router.push("/panel")}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                {restoreCopy.goToPanel}
              </button>
              <Link
                href="/"
                className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)]"
              >
                {copy.links.backToLogin}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={restoreCopy.newPassword}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-10 py-3 text-sm text-[var(--color-text-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={restoreCopy.confirmPassword}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-10 py-3 text-sm text-[var(--color-text-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                  required
                />
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {restoreCopy.submit}
              </button>

              <div className="text-center text-xs">
                <Link
                  href="/"
                  className="font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)]"
                >
                  {copy.links.backToLogin}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
