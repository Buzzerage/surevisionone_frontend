"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowUpRight, Crown, Loader2, Mail, ShieldCheck, Trash2 } from "lucide-react";
import ProfileCard from "./components/ProfileCard";
import PasswordForm, { type PasswordFormValues } from "./components/PasswordForm";
import StatusBanner from "./components/StatusBanner";
import { PLAN_LIBRARY } from "./constants";
import { normalizePlanName, resolveRenewalDate } from "./utils";
import type { FeedbackState, PlanObject, ProfileUser } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

const emptyForm: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

type ProfilePanelProps = {
  user: ProfileUser;
};

const ProfilePanel = ({ user }: ProfilePanelProps) => {
  const router = useRouter();

  const [formValues, setFormValues] = useState<PasswordFormValues>(emptyForm);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const planObject =
    typeof user?.plan === "object" && user.plan !== null
      ? (user.plan as PlanObject)
      : undefined;

  const normalizedPlan = useMemo(
    () => normalizePlanName(user?.plan),
    [user?.plan]
  );

  const planMetadata = PLAN_LIBRARY[normalizedPlan] ?? PLAN_LIBRARY.Free;
  const planStatus = planObject?.status ?? planObject?.state;
  const renewalDate = resolveRenewalDate(planObject);

  const quota = planObject?.quota ?? planObject?.limits;
  const opportunitiesPerDay = quota?.opportunitiesPerDay;
  const alertsPerDay = quota?.alerts;
  const refreshIntervalMinutes =
    quota?.refreshIntervalMinutes ?? quota?.refresh_interval_minutes;

  const fullName = user?.full_name ?? user?.name;
  const email = user?.email ?? "—";

  const updateFormValue = (field: keyof PasswordFormValues, value: string) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!formValues.currentPassword || !formValues.newPassword) {
      setFeedback({
        type: "error",
        message: "Completa todos los campos para actualizar tu contraseña.",
      });
      return;
    }

    if (formValues.newPassword !== formValues.confirmPassword) {
      setFeedback({
        type: "error",
        message: "Las contraseñas nuevas no coinciden.",
      });
      return;
    }

    if (formValues.newPassword.length < 8) {
      setFeedback({
        type: "warning",
        message: "Utiliza una contraseña de al menos 8 caracteres para mayor seguridad.",
      });
      return;
    }

    if (!API_BASE_URL) {
      setFeedback({
        type: "error",
        message: "No hay una URL de API configurada para procesar el cambio.",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword,
        }),
      });

      if (!response.ok) {
        let detail = "No se pudo actualizar la contraseña.";
        try {
          const payload = await response.json();
          detail = payload?.detail ?? payload?.message ?? detail;
        } catch (error) {
          console.warn("No se pudo leer la respuesta del cambio de contraseña", error);
        }
        throw new Error(detail);
      }

      setFeedback({
        type: "success",
        message: "Tu contraseña se actualizó correctamente.",
      });
      setFormValues(emptyForm);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la contraseña.";
      setFeedback({ type: "error", message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpgradePlan = () => {
    setFeedback({
      type: "info",
      message:
        "Te mostraremos los planes disponibles en la página principal para que puedas evaluar un upgrade.",
    });
    if (typeof window !== "undefined") {
      window.open("/#pricing", "_blank", "noopener,noreferrer");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Esta acción eliminará tu cuenta y tus datos asociados. ¿Deseas continuar?"
    );

    if (!confirmation) {
      return;
    }

    if (!API_BASE_URL) {
      setFeedback({
        type: "error",
        message: "No hay una URL de API disponible para eliminar tu cuenta.",
      });
      return;
    }

    setIsDeletingAccount(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        let detail = "No se pudo eliminar la cuenta.";
        try {
          const payload = await response.json();
          detail = payload?.detail ?? payload?.message ?? detail;
        } catch (error) {
          console.warn("No se pudo leer la respuesta de eliminación", error);
        }
        throw new Error(detail);
      }

      setFeedback({
        type: "success",
        message: "Tu cuenta se eliminó correctamente. Te redirigiremos al inicio.",
      });
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la cuenta.";
      setFeedback({ type: "error", message });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-[rgba(6,182,212,0.06)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/3 bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.18),transparent_65%)] opacity-40 lg:block" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--card-bg-gradient-start),var(--card-bg-gradient-end))] px-6 py-6 shadow-[0_30px_60px_-35px_var(--color-card-glow)] backdrop-blur">
          <div className="flex items-center gap-3">
            {/* 🔙 Botón de retroceso */}
            <button
              onClick={() => router.push("/panel")}
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-accent)] transition-all hover:bg-[var(--color-hover-bg)] hover:scale-[1.03]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">
                Panel del usuario
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-accent)] sm:text-4xl">
                Tu perfil
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Administra la información asociada a tu cuenta, ajusta la seguridad y revisa el estado de tu suscripción.
              </p>
            </div>
          </div>
        </header>

        <StatusBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

        <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <ProfileCard
            icon={<Mail className="h-6 w-6" />}
            title="Información principal"
            description="Estos datos son privados y sólo tú puedes verlos."
          >
            <dl className="space-y-4 text-sm">
              {fullName ? (
                <div>
                  <dt className="text-[var(--color-text-secondary)]">Nombre completo</dt>
                  <dd className="text-lg font-medium text-[var(--color-text-accent)]">{fullName}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-[var(--color-text-secondary)]">Correo electrónico</dt>
                <dd className="text-lg font-medium text-[var(--color-text-accent)]">{email}</dd>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <dt className="text-[var(--color-text-secondary)]">Plan activo</dt>
                <dd className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background-tertiary)] px-3 py-1 text-sm font-semibold text-[var(--color-text-accent)]">
                  <Crown className="h-4 w-4 text-[var(--color-accent-primary)]" />
                  {normalizedPlan}
                </dd>
              </div>
              {planStatus ? (
                <div>
                  <dt className="text-[var(--color-text-secondary)]">Estado del plan</dt>
                  <dd className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent-primary)]">
                    {planStatus}
                  </dd>
                </div>
              ) : null}
              {renewalDate ? (
                <div>
                  <dt className="text-[var(--color-text-secondary)]">Próxima renovación</dt>
                  <dd className="text-sm font-medium text-[var(--color-text-accent)]">{renewalDate}</dd>
                </div>
              ) : null}
            </dl>
          </ProfileCard>

          <ProfileCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Seguridad"
            description="Cambiar tu contraseña ayuda a mantener la cuenta protegida."
          >
            <PasswordForm
              values={formValues}
              onChange={updateFormValue}
              onSubmit={handlePasswordSubmit}
              submitting={isUpdatingPassword}
            />
          </ProfileCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ProfileCard
            icon={<Crown className="h-6 w-6" />}
            title={`Tu plan ${normalizedPlan}`}
            description={planMetadata.description}
          >
            <ul className="space-y-3 text-sm text-[var(--color-text-accent)]">
              {planMetadata.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[linear-gradient(135deg,var(--card-bg-gradient-start),var(--card-bg-gradient-end))] px-3 py-2 shadow-[0_18px_35px_-25px_var(--color-card-glow)]"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent-primary)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {(opportunitiesPerDay || alertsPerDay || refreshIntervalMinutes) && (
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                {opportunitiesPerDay ? (
                  <div>
                    <dt className="text-[var(--color-text-secondary)]">Oportunidades al día</dt>
                    <dd className="font-medium text-[var(--color-text-accent)]">{opportunitiesPerDay}</dd>
                  </div>
                ) : null}
                {alertsPerDay ? (
                  <div>
                    <dt className="text-[var(--color-text-secondary)]">Alertas disponibles</dt>
                    <dd className="font-medium text-[var(--color-text-accent)]">{alertsPerDay}</dd>
                  </div>
                ) : null}
                {refreshIntervalMinutes ? (
                  <div>
                    <dt className="text-[var(--color-text-secondary)]">Actualización de datos</dt>
                    <dd className="font-medium text-[var(--color-text-accent)]">
                      Cada {refreshIntervalMinutes} min
                    </dd>
                  </div>
                ) : null}
              </dl>
            )}

            <button
              type="button"
              onClick={handleUpgradePlan}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-primary)] px-5 py-2 text-sm font-semibold text-[var(--color-accent-primary)] transition hover:bg-[var(--color-accent-primary)] hover:text-white"
            >
              {planMetadata.cta}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </ProfileCard>

          <ProfileCard
            icon={<AlertTriangle className="h-6 w-6" />}
            title="Zona de riesgo"
            description="Eliminar la cuenta es irreversible."
            tone="danger"
          >
            <p className="mb-5 text-sm leading-relaxed text-[var(--color-danger-text)]">
              Antes de continuar descarga tus reportes y asegúrate de no tener operaciones pendientes. Una vez
              confirmes, la información se eliminará de forma permanente.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-danger-solid)] px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_45px_-25px_var(--color-card-glow)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Eliminar cuenta
                </>
              )}
            </button>
          </ProfileCard>
        </section>
      </div>
    </div>
  );
};

export default ProfilePanel;