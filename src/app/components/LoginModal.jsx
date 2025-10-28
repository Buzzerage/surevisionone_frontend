"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, Loader, CheckCircle } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginModal({ onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [visible, setVisible] = useState(false);

  // 🪄 Animación de entrada + bloqueo del scroll
  useEffect(() => {
    setVisible(true);
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => onClose?.(), 300); // espera la animación
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    if (!BACKEND_URL) {
      setError("Error interno: falta la variable NEXT_PUBLIC_API_URL.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        let msg = data.detail || "Error al iniciar sesión.";
        if (response.status === 401 || msg.includes("Invalid login credentials")) {
          msg = "Correo o contraseña incorrectos.";
        } else if (response.status >= 500) {
          msg = "Error del servidor. Inténtalo de nuevo.";
        }
        throw new Error(msg);
      }

      setLoginSuccessful(true);
      setTimeout(() => {
        onClose?.();
        router.push("/arbitrages");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const isTransitioning = loading || loginSuccessful;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        visible
          ? "bg-black/60 backdrop-blur-sm opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={isTransitioning ? (e) => e.stopPropagation() : handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-8 transform transition-all duration-300 ease-out ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10"
        }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors ${
            isTransitioning ? "opacity-0 pointer-events-none" : ""
          }`}
          disabled={isTransitioning}
        >
          <X className="w-6 h-6" />
        </button>

        {isTransitioning ? (
          <div className="flex flex-col items-center justify-center py-10">
            {loginSuccessful ? (
              <CheckCircle className="w-16 h-16 text-green-500 animate-in fade-in zoom-in" />
            ) : (
              <Loader className="w-16 h-16 text-blue-500 animate-spin" />
            )}
            <h3 className="mt-4 text-lg text-[var(--color-text-accent)]">
              {loginSuccessful ? "Inicio exitoso" : "Validando credenciales..."}
            </h3>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
              Iniciar Sesión
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] text-[var(--color-text-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] text-[var(--color-text-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                />
              </div>

              {error && (
                <p className="text-center text-red-500 bg-red-100/10 border border-red-500/30 rounded-lg py-2 px-2">
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
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
