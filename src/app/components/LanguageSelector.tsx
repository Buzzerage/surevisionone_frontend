"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageProvider";
import type { SupportedLanguage } from "../context/translations";

type LanguageSelectorProps = {
  variant?: "compact" | "card";
  onLanguageChange?: (language: SupportedLanguage) => void | Promise<void>;
  label?: string;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "compact",
  onLanguageChange,
  label,
}) => {
  const { language, setLanguage, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (variant === "compact") {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      if (variant === "compact") {
        document.removeEventListener("mousedown", handleOutsideClick);
      }
    };
  }, [variant]);

  const handleSelect = async (code: SupportedLanguage) => {
    if (code === language) {
      setIsOpen(false);
      return;
    }
    setIsSaving(true);
    await setLanguage(code);
    if (onLanguageChange) {
      await onLanguageChange(code);
    }
    setIsSaving(false);
    setIsOpen(false);
  };

  const current = useMemo(() => availableLanguages.find((item) => item.code === language), [availableLanguages, language]);

  if (variant === "card") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label || (t("arbitrage.profile.languageLabel") as string)}
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-3 py-2 pr-8 text-sm text-[var(--color-text-accent)] focus:border-[var(--color-accent-primary)] focus:outline-none"
            value={language}
            onChange={(event) => handleSelect(event.target.value as SupportedLanguage)}
            disabled={isSaving}
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
        </div>
      </div>
    );
  }

  return (
    <div ref={selectorRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background-tertiary)] px-3 py-1.5 text-sm text-[var(--color-text-accent)] shadow-sm transition-colors hover:bg-[var(--color-hover-bg)] focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-lg" aria-hidden>
          {current?.flag || "🌐"}
        </span>
        <span className="hidden sm:inline">{current?.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-lg"
        >
          {availableLanguages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--color-hover-bg)] ${
                  lang.code === language ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-accent)]"
                }`}
                onClick={() => handleSelect(lang.code)}
              >
                <span className="text-lg" aria-hidden>
                  {lang.flag}
                </span>
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;

