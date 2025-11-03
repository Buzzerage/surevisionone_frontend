"use client";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader, Lock, Mail, RefreshCw, ShieldCheck, X } from "lucide-react";
import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";
import { useLanguageContext } from "@/providers/LanguageProvider";

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
  const [bettingRegion, setBettingRegion] = useState<"EU" | "UK" | "">("");
  const { language } = useLanguageContext();

  // animación de entrada
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
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

        if (resetError) {
          throw resetError;
        }

        setSuccessMessage(
          "Te hemos enviado un enlace seguro para restablecer tu contraseña. Revisa tu bandeja de entrada."
        );
        return;
      }

      if (mode === "register") {
        if (!bettingRegion) {
          setError("Selecciona tu región de apuestas para continuar.");
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              language,
              betting_region: bettingRegion,
            },
          },
        });
        if (signUpError) {
          throw signUpError;
        }

        const createdUserId = signUpData.user?.id;

        if (createdUserId) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert(
              { id: createdUserId, language, betting_region: bettingRegion },
              { onConflict: "id", returning: "minimal" }
            );

          if (profileError && process.env.NODE_ENV !== "production") {
            console.warn("No se pudo guardar la región de apuestas en el perfil", profileError);
          }
        }

        setSuccessMessage(
          "Cuenta creada. Revisa tu email y valida tu cuenta para poder acceder de forma segura al panel."
        );
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        throw signInError;
      }

      setSuccessMessage("Sesión iniciada correctamente. Redirigiendo al panel...");
      setTimeout(() => {
        onClose?.();
        router.push("/panel");
      }, 1200);
    } catch (err) {
      const authError = err as AuthError | Error;
      setError(authError.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        visible ? "bg-black/60 backdrop-blur-sm opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-8 transform transition-all duration-300 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
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
            <p className="text-lg text-[var(--color-text-accent)]">{successMessage}</p>
            <button
              type="button"
              className="text-sm text-blue-400 hover:text-blue-300"
              onClick={() => {
                setSuccessMessage(null);
                if (mode === "login") {
                  onClose?.();
                }
              }}
            >
              {mode === "login"
                ? "Continuar"
                : "Entendido, revisaré mi correo"}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
              {isForgot ? "Recuperar contraseña" : isRegister ? "Crear cuenta" : "Iniciar sesión"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
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
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {isRegister && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Selecciona tu región de apuestas
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["EU", "UK"].map((region) => {
                      const isActive = bettingRegion === region;
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => setBettingRegion(region as "EU" | "UK")}
                          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] ${
                            isActive
                              ? "border-[var(--color-accent-primary)] bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
                              : "border-[var(--color-border)] bg-[var(--color-background-secondary)]/60 text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)]"
                          }`}
                        >
                          {region === "EU" ? "Europa (EU)" : "Reino Unido (UK)"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isForgot && (
                <p className="text-sm text-[var(--color-text-secondary)] text-center">
                  Introduce tu correo electrónico para enviarte un enlace seguro de restablecimiento.
                </p>
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
                    Enviar enlace de recuperación
                  </>
                ) : isRegister ? (
                  "Registrarse"
                ) : (
                  "Entrar"
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
                  {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿Aún no tienes cuenta? Regístrate"}
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
                  ¿Olvidaste tu contraseña?
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
                  Volver a iniciar sesión
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
