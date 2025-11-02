"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck, RefreshCw, ShieldAlert, ShieldCheck, ShieldHalf } from "lucide-react";
import ArbitrageList from "@/features/arbitrage/components/ArbitrageList";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { supabase } from "@/lib/supabase/client";

export default function ArbitragesPage() {
  const router = useRouter();
  const { user, loading } = useSupabaseSession();
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [verificationAcknowledged, setVerificationAcknowledged] = useState(false);

  const isVerified = useMemo(() => Boolean(user?.email_confirmed_at), [user?.email_confirmed_at]);

  useEffect(() => {
    setVerificationMessage(null);
    if (isVerified) {
      setVerificationAcknowledged(true);
    }
  }, [isVerified]);

  // 🔁 Redirige solo cuando termina de cargar y no hay sesión
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // ✅ replace evita que quede en el historial
    }
  }, [loading, user, router]);

  const handleRefreshVerification = useCallback(async () => {
    setRefreshing(true);
    setVerificationMessage(null);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!data.user?.email_confirmed_at) {
        setVerificationMessage(
          "Tu cuenta todavía no figura validada. Revisa tu correo o intenta de nuevo en unos instantes."
        );
        return;
      }

      setVerificationMessage("Validación confirmada. Redirigiéndote al panel seguro...");
      setVerificationAcknowledged(true);
      setTimeout(() => {
        router.refresh();
      }, 800);
    } catch (error) {
      if (error instanceof Error) {
        setVerificationMessage(error.message);
      } else {
        setVerificationMessage("No se pudo comprobar el estado de la cuenta. Inténtalo más tarde.");
      }
    } finally {
      setRefreshing(false);
    }
  }, [router]);

  // ⏳ Muestra mensaje mientras verifica la sesión
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <ShieldHalf className="w-12 h-12 text-[var(--color-accent-primary)] animate-spin" />
        <p className="text-lg text-[var(--color-text-secondary)]">Cargando sesión segura...</p>
      </div>
    );
  }

  // 🚫 Si no hay sesión, no renderizamos nada (ya se está redirigiendo)
  if (!user) {
    return null;
  }

  if (!verificationAcknowledged) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 space-y-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <ShieldAlert className="w-14 h-14 text-yellow-400" />
            <h1 className="text-2xl font-semibold text-[var(--color-text-accent)]">
              Verifica tu correo electrónico para activar el acceso seguro
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm md:text-base">
              Hemos enviado un mensaje de confirmación a <strong>{user.email}</strong>. Una vez que valides tu cuenta,
              podrás acceder al panel con todas las medidas de seguridad activadas.
            </p>
          </div>

          <div className="bg-[var(--color-subtle-bg)] border border-[var(--color-border)] rounded-xl p-4 text-left space-y-2">
            <div className="flex items-start gap-3">
              <MailCheck className="w-5 h-5 mt-0.5 text-[var(--color-accent-primary)]" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                Si no encuentras el correo, revisa tu carpeta de spam o promociones y marca el mensaje como seguro.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 mt-0.5 text-[var(--color-green-text)]" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                Tras confirmar, vuelve aquí y presiona el enlace inferior para verificar el estado de tu cuenta.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshVerification}
            disabled={refreshing}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--color-accent-primary)] text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-70"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Comprobando verificación..." : "Ya verifiqué mi correo"}
          </button>

          {verificationMessage && (
            <p className="text-sm text-[var(--color-text-secondary)]">{verificationMessage}</p>
          )}
        </div>
      </div>
    );
  }

  // ✅ Si hay sesión y está verificada, renderiza el contenido
  return <ArbitrageList />;
}
