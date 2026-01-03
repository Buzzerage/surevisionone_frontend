"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Lock } from "lucide-react";

import { supabase } from "@/lib/supabase/browser-client";
import { markRecoverySession, clearRecoverySessionMark } from "@/lib/supabase/recoverySessionCookie";
import { useAppTranslations } from "@/lib/i18n";

export default function RestorePasswordPage() {
  const router = useRouter();
  const copy = useAppTranslations("auth");
  const restoreCopy = copy.restore;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"verifying" | "ready">("verifying");

  // 1️⃣ La sesión debe estar lista gracias al middleware/callback
  useEffect(() => {
    // Si no hay sesión tras un breve periodo, el AuthGuard o la pantalla mostrarán error
    // Pero con PKCE, al llegar aquí ya deberíamos tener cookies.
    setPhase("ready");
  }, []);

  // 2️⃣ Enviar nueva contraseña
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (phase !== "ready") {
      setError(restoreCopy.invalid);
      return;
    }

    if (password !== confirmPassword) {
      setError(restoreCopy.mismatch);
      return;
    }

    const meetsRequirements =
      password.length >= 12 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password);

    if (!meetsRequirements) {
      setError(restoreCopy.requirements);
      return;
    }

    setLoading(true);
    let passwordUpdated = false;

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({ password });

      console.log("[restore-password] updateUser response:", data, updateError);

      if (updateError) {
        throw updateError;
      }

      passwordUpdated = true;
      setSuccess(restoreCopy.success);
    } catch (err: any) {
      console.error("[restore-password] updateUser failed:", err);

      if (err?.name === "AuthSessionMissingError") {
        setError(restoreCopy.unauthorized);
      } else if (typeof err?.message === "string" && err.message.length > 0) {
        setError(err.message);
      } else {
        setError(restoreCopy.genericError);
      }
    } finally {
      console.log("[restore-password] forcing session refresh…");

      // Sign out old session, but don't wait
      supabase.auth.signOut({ scope: "global" })
        .catch(err => console.warn("SignOut global failed", err));

      // Attempt silent session refresh to ensure stability
      supabase.auth.refreshSession()
        .catch(err => console.warn("refreshSession failed", err));

      // After success: force-auth panel load
      setTimeout(() => {
        router.replace("/panel");
      }, 300);

      setLoading(false);
      clearRecoverySessionMark();
    }

  };

  // 3️⃣ UI
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-8 shadow-[0_40px_80px_-45px_var(--color-card-glow)]">
          <h1 className="text-2xl font-bold text-[var(--color-text-accent)]">{restoreCopy.title}</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{restoreCopy.subtitle}</p>

          {phase === "verifying" ? (
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
                onClick={() => router.push("/")}
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
                  onChange={(e) => setPassword(e.target.value)}
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={restoreCopy.confirmPassword}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-10 py-3 text-sm text-[var(--color-text-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

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
