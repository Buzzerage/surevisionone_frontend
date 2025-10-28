import type { PlanMetadata } from "./types";

export const PLAN_ALIASES: Record<string, string> = {
  free: "Free",
  gratis: "Free",
  starter: "Starter",
  basic: "Starter",
  pro: "Pro",
  profesional: "Pro",
  ultimate: "Ultimate",
  enterprise: "Ultimate",
};

export const PLAN_LIBRARY: Record<string, PlanMetadata> = {
  Free: {
    description:
      "Plan gratuito para conocer las funciones esenciales antes de dar el salto a una suscripción de pago.",
    features: [
      "Alertas básicas de arbitraje cada 30 minutos",
      "Seguimiento de pocas oportunidades favoritas",
      "Acceso a documentación y comunidad",
    ],
    cta: "Descubre planes con más automatización",
  },
  Starter: {
    description:
      "Pensado para traders que operan varias veces por semana y necesitan un poco más de contexto.",
    features: [
      "Cobertura de más casas de apuestas",
      "Alertas por correo para oportunidades destacadas",
      "Historial exportable en CSV",
    ],
    cta: "Mejora tu velocidad con el plan Pro",
  },
  Pro: {
    description:
      "Incluye métricas avanzadas y sincronización casi en tiempo real para los que operan a diario.",
    features: [
      "Actualizaciones cada pocos minutos",
      "Notificaciones push y vía Telegram",
      "Panel de análisis con comparativas por deporte",
    ],
    cta: "Solicita acceso a Ultimate para automatizar más",
  },
  Ultimate: {
    description:
      "Suite completa con acceso API y soporte personalizado 24/7 para equipos profesionales.",
    features: [
      "Arbitraje live sin restricciones",
      "Workflows automatizados y límites ampliados",
      "Gestor de cuenta dedicado",
    ],
    cta: "Contacta con nosotros para escalar tu operación",
  },
};