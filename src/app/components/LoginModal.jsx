"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Mail, Lock, Loader, CheckCircle, UserPlus } from "lucide-react";
import { supabase } from "./supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  // animación de entrada
  useEffect(() => {
    setVisible(true);
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => onClose?.(), 300);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (isRegister) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      setSuccess(true);
      setTimeout(() => {
        onClose?.();
        router.push("/arbitrages");
      }, 1200);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const isTransitioning = loading || success;

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
          disabled={isTransitioning}
        >
          <X className="w-6 h-6" />
        </button>

        {isTransitioning ? (
          <div className="flex flex-col items-center py-10">
            {success ? (
              <CheckCircle className="w-16 h-16 text-green-500 animate-in fade-in zoom-in" />
            ) : (
              <Loader className="w-16 h-16 text-blue-500 animate-spin" />
            )}
            <p className="mt-4 text-lg text-white">
              {success ? "Sesión iniciada correctamente" : "Procesando..."}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
              {isRegister ? "Crear cuenta" : "Iniciar sesión"}
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

              {error && <p className="text-center text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  isRegister ? "Registrarse" : "Entrar"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿Aún no tienes cuenta? Regístrate"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
