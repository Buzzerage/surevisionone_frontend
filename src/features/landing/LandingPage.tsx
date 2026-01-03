"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, Maximize, Rocket, Shield, TrendingUp, Zap } from "lucide-react";

import LoginModal from "@/components/auth/LoginModal";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { useAppTranslations } from "@/lib/i18n";
import type { LandingCopy } from "@/lib/i18n/translations";

type LandingPageProps = {
  onStartClick: () => void;
};


const FEATURE_ICONS: LucideIcon[] = [Zap, TrendingUp, Shield, Maximize];

export default function LandingPage({ onStartClick }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { language } = useLanguageContext();
  const landingCopy = useAppTranslations("landing");

  useEffect(() => {
    const openModal = () => setShowLoginModal(true);
    window.addEventListener("open-login-modal", openModal);
    return () => window.removeEventListener("open-login-modal", openModal);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);
  const copy: LandingCopy = landingCopy;
  const features = copy.features.map((feature, index) => ({
    ...feature,
    icon: FEATURE_ICONS[index] ?? FEATURE_ICONS[FEATURE_ICONS.length - 1],
  }));
  const plans = copy.pricingPlans;
  const isUkPricing = language === "en";

  const formatPrice = (amount: number) => {
    const formatter = new Intl.NumberFormat(isUkPricing ? "en-GB" : "es-ES", {
      style: "currency",
      currency: isUkPricing ? "GBP" : "EUR",
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  return (
    <>
      <div className="min-h-screen">
        <section className="pt-28 pb-20 text-center bg-[var(--color-background-primary)]">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-[var(--color-text-accent)]">
              {copy.hero.titlePrefix}
              <span className="text-[var(--color-accent-primary)]">{copy.hero.highlight}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-[var(--color-text-secondary)]">
              {copy.hero.subtitle}
            </p>
            <button
              onClick={onStartClick}
              className="inline-flex items-center justify-center px-10 py-3.5 text-lg font-bold rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.03] bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9]"
            >
              <Rocket className="w-5 h-5 mr-2" /> {copy.hero.cta}
            </button>

            <div className="mt-20 flex justify-center">
              <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl border border-[var(--color-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/earnings_graph.png"
                  alt="Earnings Graph - Projected Growth with SureVisionOne"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white text-left">
                  <p className="font-bold text-lg">Visualiza tu éxito</p>
                  <p className="text-sm opacity-90">Pasa de resultados planos a un crecimiento exponencial.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
              {copy.featuresTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
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
              {copy.pricingTitle}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-8 rounded-2xl border transition-all duration-300 ${plan.isPopular
                    ? "border-[var(--color-accent-primary)] bg-[var(--color-card-bg)] shadow-2xl scale-[1.05]"
                    : "border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md hover:shadow-xl"
                    }`}
                >
                  <h3 className="text-2xl font-bold mb-1 text-[var(--color-text-accent)]">{plan.name}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">{plan.tagline}</p>
                  <div className="text-4xl font-extrabold text-[var(--color-text-accent)] mb-1">
                    {formatPrice(isUkPricing ? plan.price.gbp : plan.price.eur)}
                  </div>

                  <button
                    onClick={onStartClick}
                    className={`w-full py-3 font-semibold rounded-lg transition-colors ${plan.isPopular
                      ? "bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9]"
                      : plan.isFree
                        ? "bg-[var(--color-green-text)] text-white hover:bg-green-600"
                        : "bg-[var(--color-background-tertiary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)]"
                      }`}
                  >
                    {plan.cta}
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
          &copy; {year} SureVisionOne. {copy.footer}
        </footer>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
