"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck, RefreshCw, ShieldAlert, ShieldCheck, ShieldHalf } from "lucide-react";
import ArbitrageList from "@/features/arbitrage/components/ArbitrageList";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { supabase } from "@/lib/supabase/browser-client";
import { useAppTranslations } from "@/lib/i18n";

type VerificationMessageState =
  | { type: "unverified" | "verified" | "generic-error" }
  | { type: "custom"; text: string }
  | null;

export default function ArbitragesPage() {
  const router = useRouter();
  const { user, loading } = useSupabaseSession();
  const copy = useAppTranslations("panel");
  const [verificationMessage, setVerificationMessage] =
    useState<VerificationMessageState>(null);
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
        setVerificationMessage({ type: "unverified" });
        return;
      }

      setVerificationMessage({ type: "verified" });
      setVerificationAcknowledged(true);
      setTimeout(() => {
        router.refresh();
      }, 800);
    } catch (error) {
      if (error instanceof Error) {
        setVerificationMessage({ type: "custom", text: error.message });
      } else {
        setVerificationMessage({ type: "generic-error" });
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
        <p className="text-lg text-[var(--color-text-secondary)]">{copy.loading}</p>
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
              {copy.verify.heading}
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm md:text-base">
              {copy.verify.descriptionBeforeEmail}
              <strong>{user.email}</strong>
              {copy.verify.descriptionAfterEmail}
            </p>
          </div>

          <div className="bg-[var(--color-subtle-bg)] border border-[var(--color-border)] rounded-xl p-4 text-left space-y-2">
            <div className="flex items-start gap-3">
              <MailCheck className="w-5 h-5 mt-0.5 text-[var(--color-accent-primary)]" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                {copy.verify.infoSpam}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 mt-0.5 text-[var(--color-green-text)]" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                {copy.verify.infoConfirm}
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
            {refreshing ? copy.verify.buttonLoading : copy.verify.buttonIdle}
          </button>

          {(() => {
            if (!verificationMessage) {
              return null;
            }

            const messageText =
              verificationMessage.type === "custom"
                ? verificationMessage.text
                : verificationMessage.type === "unverified"
                ? copy.verify.messageUnverified
                : verificationMessage.type === "generic-error"
                ? copy.verify.messageGenericError
                : copy.verify.messageVerified;

            return (
              <p className="text-sm text-[var(--color-text-secondary)]">{messageText}</p>
            );
          })()}
        </div>
      </div>
    );
  }

  // ✅ Si hay sesión y está verificada, renderiza el contenido
  return <ArbitrageList />;
}
