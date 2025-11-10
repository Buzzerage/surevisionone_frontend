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
  const [recoveryUserId, setRecoveryUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const hashParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.hash.replace(/^#/, ""))
        : new URLSearchParams();

    const type = searchParams.get("type");
    const queryToken = searchParams.get("token");
    const queryTokenHash = searchParams.get("token_hash");
    const queryCode = searchParams.get("code");
    const queryEmail = searchParams.get("email");

    const normalizedEmail = (() => {
      if (!queryEmail) {
        return null;
      }

      try {
        return decodeURIComponent(queryEmail);
      } catch {
        return queryEmail;
      }
    })();

    const recoveryTokens = new Set<string>();
    const tokenHashes = new Set<string>();
    const codeCandidates = new Set<string>();

    if (queryToken) {
      recoveryTokens.add(queryToken);
    }

    const hashToken = hashParams.get("token");
    if (hashToken) {
      recoveryTokens.add(hashToken);
    }

    const hashTokenHash = hashParams.get("token_hash");
    if (hashTokenHash) {
      tokenHashes.add(hashTokenHash);
    }

    if (queryTokenHash) {
      tokenHashes.add(queryTokenHash);
    }

    for (const token of recoveryTokens) {
      if (token.startsWith("pkce_")) {
        tokenHashes.add(token);
      }
    }

    const hashCode = hashParams.get("code");
    if (hashCode) {
      codeCandidates.add(hashCode);
    }

    const hashAccessToken = hashParams.get("access_token");
    if (hashAccessToken) {
      codeCandidates.add(hashAccessToken);
    }

    if (queryCode) {
      codeCandidates.add(queryCode);
    }

    if (queryToken && type !== "recovery") {
      codeCandidates.add(queryToken);
    }

    if (codeCandidates.size === 0 && tokenHashes.size === 0 && recoveryTokens.size === 0) {
      setVerificationState("ready");
      setError(restoreCopy.invalid);
      return;
    }

    const verify = async () => {
      setError(null);
      setVerificationState("verifying");

      const attempts: Array<() => Promise<string | null>> = [];

      if (type === "recovery") {
        if (normalizedEmail) {
          for (const token of recoveryTokens) {
            attempts.push(async () => {
              const { data, error } = await supabase.auth.verifyOtp({
                type: "recovery",
                email: normalizedEmail,
                token,
              });

              if (error) {
                throw error;
              }

              const userId = data.session?.user?.id ?? data.user?.id ?? null;
              return userId ?? null;
            });
          }
        }

        for (const tokenHash of tokenHashes) {
          attempts.push(async () => {
            const { data, error } = await supabase.auth.verifyOtp({
              type: "recovery",
              token_hash: tokenHash,
            });

            if (error) {
              throw error;
            }

            const userId = data.session?.user?.id ?? data.user?.id ?? null;
            return userId ?? null;
          });
        }
      }

      for (const code of codeCandidates) {
        attempts.push(async () => {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            throw userError;
          }

          return user?.id ?? null;
        });
      }

      attempts.push(async () => {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        return user?.id ?? null;
      });

      let recoveredUserId: string | null = null;
      let lastError: Error | null = null;

      for (const attempt of attempts) {
        try {
          const result = await attempt();
          if (result) {
            recoveredUserId = result;
            break;
          }
        } catch (attemptError) {
          lastError =
            attemptError instanceof Error
              ? attemptError
              : new Error(typeof attemptError === "string" ? attemptError : restoreCopy.invalid);
        }
      }

      if (!recoveredUserId) {
        throw lastError ?? new Error(restoreCopy.invalid);
      }

      if (!active) {
        return;
      }

      setRecoveryUserId(recoveredUserId);
      setVerificationState("ready");

      if (typeof window !== "undefined") {
        const currentUrl = new URL(window.location.href);
        currentUrl.hash = "";
        const paramsToStrip = ["token", "token_hash", "code", "type", "email"];
        let modified = false;

        for (const param of paramsToStrip) {
          if (currentUrl.searchParams.has(param)) {
            currentUrl.searchParams.delete(param);
            modified = true;
          }
        }

        if (modified || window.location.hash) {
          window.history.replaceState(null, "", currentUrl.toString());
        }
      }
    };

    void verify().catch((verificationError) => {
      if (!active) {
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn("No se pudo verificar el enlace de recuperación", verificationError);
      }

      const message =
        verificationError instanceof Error && verificationError.message === restoreCopy.unauthorized
          ? restoreCopy.unauthorized
          : restoreCopy.invalid;
      setError(message);
      setVerificationState("ready");
    });

    return () => {
      active = false;
    };
  }, [restoreCopy.invalid, restoreCopy.unauthorized, searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (verificationState !== "ready" || success) {
      return;
    }

    if (!recoveryUserId) {
      setError(restoreCopy.unauthorized);
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
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        throw new Error(restoreCopy.unauthorized);
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) {
        throw updateError;
      }

      await supabase.auth.signOut({ scope: "global" });
      localStorage.removeItem("sb-session");
      sessionStorage.clear();

      setSuccess(restoreCopy.success);

      setTimeout(() => {
        router.replace("/");
      }, 1500);
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
                disabled={loading || !recoveryUserId}
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
