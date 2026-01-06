"use client";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader, Lock, Mail, RefreshCw, ShieldCheck, X } from "lucide-react";
import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/browser-client";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { useAppTranslations } from "@/lib/i18n";
import {
  BETTING_REGION_FLAG_ASSETS,
  BETTING_REGION_OPTIONS,
  type BettingRegion,
} from "@/lib/regions/betting";

type LoginModalProps = {
  onClose?: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [bettingRegion, setBettingRegion] = useState<BettingRegion | "">("");
  const { language } = useLanguageContext();
  const copy = useAppTranslations("auth");

  useEffect(() => {
    setVisible(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => onClose?.(), 300);
  }, [onClose]);

  useEffect(() => {
    setError(null);
    setBettingRegion("");
  }, [mode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "forgot") {
        const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_SITE_URL + "/restore-password";
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo ?? undefined,
        });

        if (resetError) {
          throw resetError;
        }

        setSuccessMessage(copy.success.reset);
        setLoading(false);
        return; // <--- importante, evita que siga y haga signInWithPassword
      }

      if (mode === "register") {
        if (!bettingRegion) {
          setError(copy.errors.regionRequired);
          setLoading(false);
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              betting_region: bettingRegion,
              language,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // No tocar perfiles aquí → lo crea y rellena el trigger automáticamente

        setSuccessMessage(copy.success.register);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        throw signInError;
      }

      setSuccessMessage(copy.success.login);
      setTimeout(() => {
        onClose?.();
        router.push("/panel");
      }, 1200);
    } catch (err) {
      const authError = err as AuthError | Error;
      setError(authError.message || copy.errors.genericSignIn);
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${visible ? "bg-black/60 backdrop-blur-sm opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-8 transform transition-all duration-300 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-400"
          disabled={loading}
        >
          <X className="w-6 h-6" />
        </button>

        {successMessage ? (
          <div className="flex flex-col items-center py-10 text-center space-y-4">
            <ShieldCheck className="w-16 h-16 text-green-500" />

            <button
              type="button"
              onClick={() => {
                setSuccessMessage(null);
                handleClose(); // Cierra el modal con animación
              }}
              className="text-lg text-[var(--color-text-accent)] cursor-pointer hover:text-blue-400 transition focus:outline-none"
            >
              {successMessage}
            </button>

            <button
              type="button"
              className="text-sm text-blue-400 hover:text-blue-300"
              onClick={() => {
                setSuccessMessage(null);
                handleClose(); // Cierra también desde el botón secundario
              }}
            >
              {mode === "login" ? copy.buttons.continue : copy.buttons.dismiss}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
              {isForgot ? copy.titles.forgot : isRegister ? copy.titles.register : copy.titles.login}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder={copy.placeholders.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {!isForgot && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder={copy.placeholders.password}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {isRegister && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">{copy.regionLabel}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {BETTING_REGION_OPTIONS.map((region) => {
                      const isActive = bettingRegion === region;
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => setBettingRegion(region)}
                          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] ${isActive
                            ? "border-[var(--color-accent-primary)] bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
                            : "border-[var(--color-border)] bg-[var(--color-background-secondary)]/60 text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)]"
                            }`}
                          aria-label={copy.regionOptions[region]}
                        >
                          <span className="flex flex-col items-center gap-1">
                            <span
                              className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-background-secondary)]"
                              aria-hidden="true"
                            >
                              <Image
                                src={BETTING_REGION_FLAG_ASSETS[region].src}
                                alt={BETTING_REGION_FLAG_ASSETS[region].alt}
                                width={64}
                                height={48}
                                className="h-12 w-16 object-cover"
                              />
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              {region}
                            </span>
                            <span className="text-[10px] font-medium normal-case text-[var(--color-text-secondary)]" aria-hidden="true">
                              {copy.regionOptions[region]}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isForgot && (
                <p className="text-sm text-[var(--color-text-secondary)] text-center">{copy.forgotInstructions}</p>
              )}

              {error && <p className="text-center text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading || (isRegister && !bettingRegion)}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : isForgot ? (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    {copy.buttons.sendReset}
                  </>
                ) : isRegister ? (
                  copy.buttons.register
                ) : (
                  copy.buttons.login
                )}
              </button>
            </form>

            <div className="flex flex-col items-center gap-2 mt-6 text-center">
              {!isForgot && (
                <button
                  onClick={() => setMode(isRegister ? "login" : "register")}
                  className="text-sm text-blue-400 hover:text-blue-300"
                  type="button"
                >
                  {isRegister ? copy.links.haveAccount : copy.links.needAccount}
                </button>
              )}

              {!isForgot && (
                <button
                  onClick={() => {
                    setMode("forgot");
                    setPassword("");
                    setError(null);
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300"
                  type="button"
                >
                  {copy.links.forgotPassword}
                </button>
              )}

              {isForgot && (
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300"
                  type="button"
                >
                  {copy.links.backToLogin}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
