"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, DollarSign, Maximize, Rocket, Shield, TrendingUp, Zap } from "lucide-react";

import LoginModal from "@/components/auth/LoginModal";

type LandingPageProps = {
  onStartClick: () => void;
};

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type PricingPlan = {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  isPopular?: boolean;
  isFree?: boolean;
};

type ArbitrageExample = {
  percentage: number;
  team1: string;
  team2: string;
};

const FEATURES: Feature[] = [
  {
    title: "Arbitraje en Tiempo Real",
    description:
      "Escaneo ultrarrápido a través de más de 80 casas de apuestas y exchanges para no perderte ni una oportunidad.",
    icon: Zap,
  },
  {
    title: "Seguimiento de Beneficios",
    description:
      "Visualiza tus ganancias y pérdidas históricas, rendimiento por deporte y análisis detallado de ROI.",
    icon: TrendingUp,
  },
  {
    title: "Seguridad y Transparencia",
    description:
      "Cálculos verificados y encriptación de datos para garantizar la seguridad de tu información financiera.",
    icon: Shield,
  },
  {
    title: "Calculadora Integrada",
    description:
      "Ajusta automáticamente las apuestas 'back' y 'lay' basándose en tu bankroll disponible.",
    icon: Maximize,
  },
];

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: "€0",
    tagline: "Acceso permanente a la plataforma con arbitrajes básicos.",
    features: [
      "Escaneo en 5 casas de apuestas",
      "Arbitrajes con beneficio > 3.0%",
      "Retraso de datos de 30 minutos",
      "Soporte por documentación",
    ],
    isFree: true,
  },
  {
    name: "Starter",
    price: "€29",
    tagline: "Ideal para principiantes que empiezan a explorar el arbitraje.",
    features: [
      "Escaneo en 20+ casas de apuestas",
      "Arbitrajes con beneficio > 1.5%",
      "Notificaciones por email",
      "Soporte Estándar",
    ],
  },
  {
    name: "Pro",
    price: "€99",
    tagline: "Herramientas avanzadas para arbitrajistas a tiempo parcial.",
    features: [
      "Escaneo en 80+ casas de apuestas",
      "Arbitrajes con beneficio > 0%",
      "Notificaciones instantáneas (SMS/Telegram)",
      "Calculadora de Arbitraje avanzada",
      "Soporte Premium 24/7",
    ],
    isPopular: true,
  },
  {
    name: "Ultimate",
    price: "€199",
    tagline: "Máxima velocidad y acceso a arbitrajes en tiempo real y trading.",
    features: [
      "Escaneo en 100+ plataformas (incluye Exchanges)",
      "Arbitrajes Pre-partido y Live",
      "Arbitrajes con beneficio > 0%",
      "API de Integración (Beta)",
      "Asesor Personalizado",
    ],
  },
];

const ARBITRAGE_EXAMPLES: ArbitrageExample[] = [
  { percentage: 2.85, team1: "Lakers", team2: "Celtics" },
  { percentage: 1.9, team1: "Real Madrid", team2: "Barcelona" },
];

function ArbitrageListMockup() {
  return (
    <div className="w-full h-full p-4 md:p-6 bg-[var(--color-card-bg)] rounded-xl shadow-inner border border-[var(--color-border)]">
      <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-accent)] flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-[var(--color-green-text)]" />
        Oportunidades de Arbitraje
      </h3>

      {ARBITRAGE_EXAMPLES.map((arb) => (
        <div
          key={`${arb.team1}-${arb.team2}`}
          className="p-4 mb-3 rounded-xl bg-[var(--color-subtle-bg)] border border-[var(--color-border)] shadow-md"
        >
          <div className="text-sm font-bold inline-block px-3 py-1 rounded-full mb-3 bg-[var(--color-green-text)] text-white shadow-lg">
            +{arb.percentage.toFixed(2)}%
          </div>
          <p className="text-md font-medium text-[var(--color-text-accent)]">
            {arb.team1} vs {arb.team2}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage({ onStartClick }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const openModal = () => setShowLoginModal(true);
    window.addEventListener("open-login-modal", openModal);
    return () => window.removeEventListener("open-login-modal", openModal);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <div className="min-h-screen">
        <section className="pt-28 pb-20 text-center bg-[var(--color-background-primary)]">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-[var(--color-text-accent)]">
              Convierte el riesgo en beneficio con{" "}
              <span className="text-[var(--color-accent-primary)]">SureVisionOne</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-[var(--color-text-secondary)]">
              El escáner de arbitraje más rápido para apuestas deportivas. Encuentra apuestas seguras y garantiza ganancias sin riesgo.
            </p>
            <button
              onClick={onStartClick}
              className="inline-flex items-center justify-center px-10 py-3.5 text-lg font-bold rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.03] bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9]"
            >
              <Rocket className="w-5 h-5 mr-2" /> Comenzar Gratis
            </button>

            <div className="mt-20">
              <ArbitrageListMockup />
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
              Características que Garantizan el Éxito
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="p-6 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Icon className="w-10 h-10 mb-4 text-[var(--color-accent-primary)]" />
                    <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-accent)]">{feature.title}</h3>
                    <p className="text-[var(--color-text-secondary)] text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-[var(--color-background-primary)] border-t border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
              Planes de Suscripción Flexibles
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-8 rounded-2xl border transition-all duration-300 ${
                    plan.isPopular
                      ? "border-[var(--color-accent-primary)] bg-[var(--color-card-bg)] shadow-2xl scale-[1.05]"
                      : "border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md hover:shadow-xl"
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-1 text-[var(--color-text-accent)]">{plan.name}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">{plan.tagline}</p>
                  <div className="text-4xl font-extrabold text-[var(--color-text-accent)] mb-1">{plan.price}</div>

                  <button
                    onClick={onStartClick}
                    className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                      plan.isPopular
                        ? "bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9]"
                        : plan.isFree
                        ? "bg-[var(--color-green-text)] text-white hover:bg-green-600"
                        : "bg-[var(--color-background-tertiary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)]"
                    }`}
                  >
                    {plan.isFree
                      ? "Empezar Gratis"
                      : plan.isPopular
                      ? "Comenzar con Pro"
                      : "Seleccionar Plan"}
                  </button>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start text-[var(--color-text-primary)]">
                        <Check className="w-5 h-5 mr-2 text-[var(--color-green-text)]" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] text-center text-sm text-[var(--color-text-secondary)]">
          &copy; {year} SureVisionOne. Todos los derechos reservados.
        </footer>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
