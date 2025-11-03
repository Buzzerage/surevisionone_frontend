"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Zap,
  TrendingUp,
  Shield,
  DollarSign,
  CreditCard,
  Rocket,
  Check,
  Star,
  Clock,
  Maximize,
  LogIn,
  Sun,
  Moon,
  LogOut,
  PiggyBank,
} from "lucide-react";
import LoginModal from "./LoginModal";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../context/LanguageProvider";

const FEATURE_CONFIG = [
  { key: "realTime", icon: Zap },
  { key: "profitTracking", icon: TrendingUp },
  { key: "security", icon: Shield },
  { key: "calculator", icon: Maximize },
];

const PLAN_CONFIG = [
  { key: "free", price: 0, isPopular: false, isFree: true },
  { key: "starter", price: 29, isPopular: false, isFree: false },
  { key: "pro", price: 99, isPopular: true, isFree: false },
  { key: "ultimate", price: 199, isPopular: false, isFree: false },
];

const CURRENCY_RATES = {
  EUR: 1,
  GBP: 0.86,
};

const useTheme = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
    document.documentElement.style.setProperty(
      "--color-background-primary",
      savedTheme === "dark" ? "#0d111c" : "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--color-background-secondary",
      savedTheme === "dark" ? "#161b22" : "#f0f4f8"
    );
    document.documentElement.style.setProperty(
      "--color-background-tertiary",
      savedTheme === "dark" ? "#21262d" : "#e0e4e8"
    );
    document.documentElement.style.setProperty(
      "--color-text-primary",
      savedTheme === "dark" ? "#f0f6fc" : "#1c2128"
    );
    document.documentElement.style.setProperty(
      "--color-text-secondary",
      savedTheme === "dark" ? "#8b949e" : "#57606a"
    );
    document.documentElement.style.setProperty(
      "--color-text-accent",
      savedTheme === "dark" ? "#c9d1d9" : "#1c2128"
    );
    document.documentElement.style.setProperty("--color-accent-primary", "#1e90ff");
    document.documentElement.style.setProperty("--color-green-text", "#3fb950");
    document.documentElement.style.setProperty("--color-red-text", "#f85149");
    document.documentElement.style.setProperty(
      "--color-card-bg",
      savedTheme === "dark" ? "#1f242b" : "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--color-border",
      savedTheme === "dark" ? "#30363d" : "#d0d7de"
    );
    document.documentElement.style.setProperty(
      "--color-subtle-bg",
      savedTheme === "dark" ? "#2d333b" : "#f6f8fa"
    );
    document.documentElement.style.setProperty(
      "--color-hover-bg",
      savedTheme === "dark" ? "#3e444b" : "#e8ebed"
    );
    document.documentElement.style.setProperty(
      "--color-input-border",
      savedTheme === "dark" ? "#444c56" : "#c9d1d9"
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return { theme, toggleTheme };
};

const Header = ({ theme, toggleTheme, onLogin, onLogout, user }) => {
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  const { t } = useLanguage();

  const navigateToArbitrage = () => {
    window.location.assign("/arbitrages");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-[var(--color-background-primary)] shadow-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-2xl font-bold text-[var(--color-accent-primary)] cursor-pointer">
          {t("landing.brand") as string}
        </span>
        <nav className="flex items-center space-x-4">
          <a
            href="#features"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors text-sm font-medium hidden md:block"
          >
            {t("landing.nav.features") as string}
          </a>
          <a
            href="#pricing"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors text-sm font-medium hidden md:block"
          >
            {t("landing.nav.pricing") as string}
          </a>

          {user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={navigateToArbitrage}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] bg-[var(--color-green-text)] text-white shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500/50"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                <span>{t("landing.nav.goToArbitrage") as string}</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors bg-red-600 text-white hover:bg-red-700 shadow-md"
                title={t("landing.nav.logout") as string}
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                <span>{t("landing.nav.logout") as string}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9] shadow-md hover:shadow-lg"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span>{t("landing.nav.login") as string}</span>
            </button>
          )}

          <LanguageSelector />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--color-background-tertiary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)] transition-colors"
            aria-label={`${t("common.theme")} ${theme === "dark" ? "light" : "dark"}`}
          >
            <ThemeIcon className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
};

const ArbitrageListMockup = ({ formatAmount, stakeLabel }) => {
  const { t } = useLanguage();
  const arbitrageData = [
    {
      percentage: 2.85,
      team1: "Lakers",
      team2: "Celtics",
      odds1: 1.88,
      odds2: 2.3,
      bookmaker1: "Betfair",
      bookmaker2: "Pinnacle",
    },
    {
      percentage: 1.9,
      team1: "Real Madrid",
      team2: "Barcelona",
      odds1: 2.05,
      odds2: 2.15,
      bookmaker1: "Bet365",
      bookmaker2: "Smarkets",
    },
    {
      percentage: 3.12,
      team1: "Man. City",
      team2: "Liverpool",
      odds1: 1.75,
      odds2: 2.45,
      bookmaker1: "William Hill",
      bookmaker2: "Betfair Exchange",
    },
  ];

  return (
    <div className="w-full h-full p-4 md:p-6 bg-[var(--color-card-bg)] rounded-xl shadow-inner border border-[var(--color-border)]">
      <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-accent)] flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-[var(--color-green-text)]" />
        {t("landing.arbitrageMock.heading") as string}
      </h3>
      <div className="mb-4 p-3 rounded-lg bg-[var(--color-background-tertiary)] flex justify-between items-center text-sm">
        <span className="text-[var(--color-text-secondary)]">{t("landing.arbitrageMock.capital") as string}</span>
        <span className="font-bold text-[var(--color-text-accent)] flex items-center">
          {formatAmount(10000)}
          <CreditCard className="w-4 h-4 ml-2 text-[var(--color-accent-primary)]" />
        </span>
      </div>
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {arbitrageData.map((arb, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-[var(--color-subtle-bg)] border border-[var(--color-border)] shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="text-sm font-bold inline-block px-3 py-1 rounded-full mb-3 bg-[var(--color-green-text)] text-white shadow-lg">
              +{arb.percentage.toFixed(2)}%
            </div>
            <p className="text-md font-medium text-[var(--color-text-accent)] mb-3">
              {arb.team1} vs {arb.team2}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--color-background-primary)] border border-green-500/30">
                <span className="text-xs font-semibold uppercase text-[var(--color-text-secondary)] block mb-1">
                  BACK ({arb.bookmaker1})
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-extrabold text-[var(--color-green-text)]">{arb.odds1.toFixed(2)}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {stakeLabel}: {formatAmount((10000 * 100) / arb.percentage / arb.odds1)}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-background-primary)] border border-red-500/30">
                <span className="text-xs font-semibold uppercase text-[var(--color-text-secondary)] block mb-1">
                  LAY ({arb.bookmaker2})
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-extrabold text-[var(--color-red-text)]">{arb.odds2.toFixed(2)}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {stakeLabel}: {formatAmount((10000 * 100) / arb.percentage / arb.odds2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-right text-[var(--color-text-secondary)]">
        <Clock className="w-3 h-3 inline mr-1" />
        {t("landing.arbitrageMock.updated") as string}
      </p>
    </div>
  );
};

export default function LandingPage({ onStartClick }) {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [pricingCurrency, setPricingCurrency] = useState("EUR");
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();

  useEffect(() => {
    const match = document.cookie.match(/sb-access-token=([^;]+)/);
    if (match) {
      setUser({ name: "User", token: match[1] });
    }
  }, []);

  const handleLogin = () => setShowLoginModal(true);
  const handleLogout = () => {
    setUser(null);
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };
  const handleCloseModal = () => setShowLoginModal(false);
  const handleAuthSuccess = (session) => {
    const email = session?.user?.email || "User";
    setUser({ name: email, token: session?.access_token });
    setShowLoginModal(false);
  };

  const currencyFormatter = useMemo(() => {
    const currency = pricingCurrency === "GBP" ? "GBP" : "EUR";
    const locale = language === "es" ? "es-ES" : "en-GB";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
  }, [language, pricingCurrency]);

  const formatAmount = (amountEur) => {
    const rate = CURRENCY_RATES[pricingCurrency] || 1;
    return currencyFormatter.format(amountEur * rate);
  };

  const stakeLabel = t("landing.arbitrageMock.stake") as string;
  const CTA_BUTTON = t("landing.hero.cta") as string;

  const renderPlanFeatures = (planKey) => {
    const features = t(`landing.pricing.plans.${planKey}.features`);
    return Array.isArray(features) ? features : [];
  };

  return (
    <div className="min-h-screen">
      <Header theme={theme} toggleTheme={toggleTheme} onLogin={handleLogin} onLogout={handleLogout} user={user} />

      <section className="pt-28 pb-20 md:pt-40 md:pb-32 text-center overflow-hidden bg-[var(--color-background-primary)]">
        <div className="max-w-7xl mx-auto px-6">
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-[var(--color-text-accent)]"
            dangerouslySetInnerHTML={{ __html: t("landing.hero.title") as string }}
          />
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-[var(--color-text-secondary)]">
            {t("landing.hero.subtitle") as string}
          </p>
          <button
            onClick={onStartClick}
            className="inline-flex items-center justify-center px-10 py-3.5 text-lg font-bold rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.03] bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)] focus:ring-opacity-50"
          >
            <Rocket className="w-5 h-5 mr-2" />
            {CTA_BUTTON}
          </button>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            {t("landing.hero.note") as string}
          </p>

          <div className="mt-20 relative transform perspective-[1000px] rotateX-[1deg] md:rotateX-[2deg]">
            <div className="max-w-4xl mx-auto">
              <ArbitrageListMockup formatAmount={formatAmount} stakeLabel={stakeLabel} />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 md:py-32 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
            {t("landing.features.heading") as string}
          </h2>
          <p className="text-center text-lg mb-16 text-[var(--color-text-secondary)] max-w-4xl mx-auto">
            {t("landing.features.intro") as string}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURE_CONFIG.map((feature) => {
              const Icon = feature.icon;
              const title = t(`landing.features.items.${feature.key}.title`) as string;
              const description = t(`landing.features.items.${feature.key}.description`) as string;
              return (
                <div
                  key={feature.key}
                  className="p-6 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-5px]"
                >
                  <Icon className="w-10 h-10 mb-4 text-[var(--color-accent-primary)]" />
                  <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-accent)]">{title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 md:py-32 bg-[var(--color-background-primary)] border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
            {t("landing.pricing.heading") as string}
          </h2>
          <p className="text-center text-lg mb-12 text-[var(--color-text-secondary)] max-w-4xl mx-auto">
            {t("landing.pricing.intro") as string}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex p-1 rounded-full bg-[var(--color-background-secondary)] border border-[var(--color-border)]">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-[var(--color-accent-primary)] text-white shadow-md"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)]"
                }`}
              >
                {t("landing.pricing.billing.monthly") as string}
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors relative ${
                  billingCycle === "yearly"
                    ? "bg-[var(--color-accent-primary)] text-white shadow-md"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)]"
                }`}
              >
                {t("landing.pricing.billing.yearly") as string}
                <span className="absolute -top-2 right-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold transform rotate-6">
                  {t("landing.pricing.billing.discount") as string}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-[var(--color-accent-primary)]" />
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                {t("landing.pricing.currencyLabel") as string}
              </label>
              <select
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-3 py-1 text-sm text-[var(--color-text-accent)] focus:border-[var(--color-accent-primary)] focus:outline-none"
                value={pricingCurrency}
                onChange={(event) => setPricingCurrency(event.target.value)}
              >
                <option value="EUR">{t("common.currencies.EUR") as string}</option>
                <option value="GBP">{t("common.currencies.GBP") as string}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {PLAN_CONFIG.map((plan) => {
              const planInfo = t(`landing.pricing.plans.${plan.key}`) as Record<string, unknown>;
              const planName = planInfo?.name as string;
              const tagline = planInfo?.tagline as string;
              const cta = planInfo?.cta as string;
              const monthlyPrice = plan.price;
              const isFree = plan.isFree;

              const priceLabel = isFree
                ? formatAmount(0)
                : billingCycle === "monthly"
                ? formatAmount(monthlyPrice)
                : formatAmount(monthlyPrice * 0.8 * 12);

              const savingsAmount = !isFree && billingCycle === "yearly"
                ? formatAmount(monthlyPrice * 12 - monthlyPrice * 0.8 * 12)
                : null;

              return (
                <div
                  key={plan.key}
                  className={`p-8 rounded-2xl border transition-all duration-300 transform ${
                    plan.isPopular
                      ? "border-[var(--color-accent-primary)] bg-[var(--color-card-bg)] shadow-2xl scale-[1.05] lg:scale-[1.02]"
                      : "border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md hover:shadow-xl"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="text-sm font-bold text-center text-white bg-[var(--color-accent-primary)] rounded-full py-1 px-4 mb-4 inline-block">
                      <Star className="inline-block h-4 w-4 mr-1" />
                      {t("landing.pricing.popularBadge") as string}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-1 text-[var(--color-text-accent)]">{planName}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">{tagline}</p>
                  <div className="text-4xl font-extrabold text-[var(--color-text-accent)] mb-1">
                    {priceLabel}
                    <span className="text-lg font-normal text-[var(--color-text-secondary)]">
                      {!isFree && (billingCycle === "monthly" ? "/" + t("landing.pricing.billing.monthly") : "/" + t("landing.pricing.billing.yearly"))}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-8 h-4">
                    {savingsAmount ? (t("landing.pricing.savings", { amount: savingsAmount }) as string) : ""}
                  </p>
                  <button
                    onClick={onStartClick}
                    className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                      plan.isPopular
                        ? "bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9] shadow-lg"
                        : isFree
                        ? "bg-[var(--color-green-text)] text-white hover:bg-green-600 shadow-lg"
                        : "bg-[var(--color-background-tertiary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)]"
                    }`}
                  >
                    {cta}
                  </button>
                  <ul className="mt-8 space-y-3">
                    {renderPlanFeatures(plan.key).map((feature, i) => (
                      <li key={i} className="flex items-start text-[var(--color-text-primary)]">
                        <Check className="w-5 h-5 mr-2 text-[var(--color-green-text)] flex-shrink-0" />
                        <span className="text-sm">{feature as string}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)]">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[var(--color-text-secondary)]">
          &copy; {new Date().getFullYear()} SureVisionOne. {t("landing.footer.rights") as string}
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">
              {t("landing.footer.terms") as string}
            </a>
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">
              {t("landing.footer.privacy") as string}
            </a>
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">
              {t("landing.footer.contact") as string}
            </a>
          </div>
        </div>
      </footer>

      {showLoginModal && (
        <LoginModal onClose={handleCloseModal} onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

