"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase/browser-client";
import { useAppTranslations } from "@/lib/i18n";

// 🧩 Utilidad para evitar “cargando infinito”
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.error(`[withTimeout] ${label} timed out after ${ms}ms`);
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

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

  // 1️⃣ Procesar sesión implícita (ya procesada por detectSessionInUrl)
  useEffect(() => {
    const processSession = async () => {
      try {
        console.log("[restore-password] Checking session after redirect…");
        const { data, error } = await withTimeout(
          supabase.auth.getSession(),
          8000,
          "getSession(after redirect)"
        );

        if (error) {
          console.warn("[restore-password] getSession error:", error);
          setError(restoreCopy.invalid);
        }

        console.log("[restore-password] Session after redirect:", data.session);
        setPhase("ready");
      } catch (err) {
        console.error("[restore-password] Error restoring session:", err);
        setError(restoreCopy.invalid);
        setPhase("ready");
      }
    };

    processSession();
  }, [restoreCopy.invalid]);

  // 2️⃣ Enviar nueva contraseña
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Por si acaso alguien pulsa mientras aún está “verifying”
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

    try {
      console.log("[restore-password] start updateUser", { password });

      // 🔒 Aseguramos que sigue habiendo sesión válida justo antes
      const {
        data: { session },
      } = await withTimeout(
        supabase.auth.getSession(),
        8000,
        "getSession(before updateUser)"
      );

      if (!session?.user) {
        console.error("[restore-password] No session before updateUser");
        throw new Error(restoreCopy.unauthorized);
      }

      // 🧩 Cambio de contraseña con timeout defensivo
      const { data, error: updateError } = await withTimeout(
        supabase.auth.updateUser({ password }),
        12000,
        "updateUser(password)"
      );

      console.log("[restore-password] updateUser response:", data, updateError);

      if (updateError) {
        throw updateError;
      }

      setSuccess(restoreCopy.success);

      // 🧩 Cerrar sesión temporal tras cambiar la contraseña (también con timeout)
      try {
        console.log("[restore-password] signing out global session…");
        await withTimeout(
          supabase.auth.signOut({ scope: "global" }),
          8000,
          "signOut(global)"
        );
        console.log("[restore-password] signOut completed");
      } catch (signOutErr) {
        console.warn("[restore-password] signOut failed (continuing anyway):", signOutErr);
      }

      setTimeout(() => {
        router.replace("/");
      }, 1200);
    } catch (err: unknown) {
      console.error("[restore-password] updateUser failed:", err);

      const errorObject = err as { name?: unknown; message?: unknown } | null;

      // Caso típico cuando la sesión se pierde en medio del flujo
      if (errorObject?.name === "AuthSessionMissingError") {
        setError(restoreCopy.unauthorized);
      } else if (typeof errorObject?.message === "string" && errorObject.message.length > 0) {
        setError(errorObject.message);
      } else {
        setError(restoreCopy.genericError);
      }
    } finally {
      // 💡 Pase lo que pase (éxito / error / timeout), el loading se apaga
      setLoading(false);
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
