"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, Loader, CheckCircle } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL; // usa el nombre estándar

export default function LoginModal({ onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

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
        credentials: "include", // 🔥 MUY IMPORTANTE: envía cookies HTTP-only
        body: JSON.stringify({ email, password }),
      });

      // Manejo de errores HTTP
      if (!response.ok) {
        let data = {};
        try {
          data = await response.json();
        } catch (_) {
          data = {};
        }

        if (response.status === 401) {
          throw new Error(data.detail || "Correo o contraseña incorrectos.");
        } else if (response.status === 400) {
          throw new Error(data.detail || "Datos inválidos.");
        } else if (response.status >= 500) {
          throw new Error("Error en el servidor. Intenta de nuevo más tarde.");
        } else {
          throw new Error(data.detail || "Error desconocido al iniciar sesión.");
        }
      }

      // Si llega aquí → login correcto
      setLoginSuccessful(true);

      setTimeout(() => {
        onClose?.(); // Cierra el modal
        router.push("/arbitrages"); // Redirige al dashboard
      }, 1500);
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const isTransitioning = loading || loginSuccessful;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={isTransitioning ? (e) => e.stopPropagation() : onClose}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors ${isTransitioning ? "opacity-0 pointer-events-none" : ""}`}
          disabled={isTransitioning}
        >
          <X className="w-6 h-6" />
        </button>

        {/* 🔁 Pantalla de carga / éxito */}
        {isTransitioning ? (
          <div className="flex flex-col items-center justify-center py-12">
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-background-secondary)] text-[var(--color-text-accent)]"
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-center text-red-500 bg-red-100 rounded-lg py-2 px-2">
                  {error}
                </p>
              )}

              {/* Submit */}
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
