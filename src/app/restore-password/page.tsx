"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Lock } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { useAppTranslations } from "@/lib/i18n";

// --- Util: timeout para promesas (evita "cargas infinitas")
function withTimeout<T>(p: Promise<T>, ms = 10000, label = "operation"): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    p.then(v => { clearTimeout(t); resolve(v); })
     .catch(e => { clearTimeout(t); reject(e); });
  });
}

// --- Util: limpiar parámetros de auth de la URL
function scrubAuthFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.hash = "";
  const toDelete = ["token","token_hash","code","type","email","error","error_code","error_description"];
  let modified = false;
  for (const k of toDelete) {
    if (url.searchParams.has(k)) { url.searchParams.delete(k); modified = true; }
  }
  if (modified || window.location.hash) {
    window.history.replaceState({}, "", url.toString());
  }
}

export default function RestorePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = useAppTranslations("auth");
  const restoreCopy = copy.restore;

  const [phase, setPhase] = useState<"verifying" | "ready">("verifying");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Congelamos una key estable para deps del effect
  const searchParamsKey = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    let active = true;

    async function verify() {
      setError(null);
      setPhase("verifying");

      // 1) Si ya hay sesión, damos paso directamente
      try {
        const { data: { session } } = await withTimeout(supabase.auth.getSession(), 7000, "getSession");
        if (!active) return;
        if (session?.user?.id) {
          setUserId(session.user.id);
          setPhase("ready");
          scrubAuthFromUrl();
          return;
        }
      } catch (e) {
        // seguimos intentando otras rutas
      }

      // 2) Leemos posibles credenciales en URL
      const qs = new URLSearchParams(searchParamsKey);
      const rawCode = qs.get("code") || (typeof window !== "undefined" ? new URLSearchParams(window.location.hash.replace(/^#/, "")).get("code") : null);
      const token = qs.get("token");
      const email = qs.get("email");

      let gotUserId: string | null = null;
      let lastErr: Error | null = null;

      // 2a) Intentar exchange por code (cuando Supabase te pone ?code= o #code=)
      if (rawCode) {
        try {
          const { data, error: exErr } = await withTimeout(supabase.auth.exchangeCodeForSession(rawCode), 10000, "exchangeCodeForSession");
          if (!active) return;
          if (exErr) throw exErr;
          gotUserId = data.session?.user?.id ?? data.user?.id ?? null;
        } catch (e: any) {
          lastErr = e instanceof Error ? e : new Error(String(e));
        }
      }

      // 2b) Intentar verifyOtp con token + email (cuando la plantilla manda estos)
      if (!gotUserId && token && email) {
        try {
          const { data, error: vErr } = await withTimeout(
            supabase.auth.verifyOtp({ type: "recovery", token, email }),
            10000,
            "verifyOtp(recovery)"
          );
          if (!active) return;
          if (vErr) throw vErr;
          gotUserId = data.session?.user?.id ?? data.user?.id ?? null;
        } catch (e: any) {
          lastErr = e instanceof Error ? e : new Error(String(e));
        }
      }

      // 2c) Último intento: quizá ya hay sesión tras lo anterior
      if (!gotUserId) {
        try {
          const { data: { session } } = await withTimeout(supabase.auth.getSession(), 7000, "getSession-final");
          if (!active) return;
          gotUserId = session?.user?.id ?? null;
        } catch (e) {
          // ignoramos
        }
      }

      if (!active) return;

      if (gotUserId) {
        setUserId(gotUserId);
        setPhase("ready");
        scrubAuthFromUrl();
        return;
      }

      // Si llega aquí, no se pudo validar
      const qsError = qs.get("error_description");
      setError(qsError ?? restoreCopy.invalid);
      setPhase("ready");
    }

    verify().catch((e) => {
      if (!active) return;
      if (process.env.NODE_ENV !== "production") {
        console.warn("Verification failed:", e);
      }
      setError(restoreCopy.invalid);
      setPhase("ready");
    });

    return () => { active = false; };
  }, [searchParamsKey, restoreCopy.invalid]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError(restoreCopy.unauthorized);
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

    // ✅ IMPORTANTE: evitar refresh de sesión
    const { error: updateError } = await supabase.auth.updateUser(
      { password },
      { skipSessionRefresh: true } // 👈 ESTA ES LA CLAVE
    );

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // ✅ Mostrar mensaje de éxito antes de cerrar sesión
    setSuccess(restoreCopy.success);
    setLoading(false);

    setTimeout(async () => {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/");
    }, 1200);
  };

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

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <button
                type="submit"
                disabled={loading || !userId}
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
