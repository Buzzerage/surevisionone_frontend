"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useLanguageContext } from "@/providers/LanguageProvider";
import type { LanguageCode } from "@/lib/i18n/language";

type LanguageSelectFieldProps = {
  className?: string;
  value?: LanguageCode;
  onChange?: (code: LanguageCode) => void;
};

const LanguageSelectField = ({ className, value, onChange }: LanguageSelectFieldProps) => {
  const { language, setLanguage, options, loading } = useLanguageContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = value ?? language;
  const selectedOption = options.find((option) => option.code === selectedLanguage) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (code: LanguageCode) => {
    setOpen(false);
    if (code === selectedLanguage) {
      return;
    }
    onChange?.(code);
    void setLanguage(code);
  };

  return (
    <div ref={containerRef} className={`relative mt-1 ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        disabled={loading}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-accent)] shadow-sm transition hover:bg-[var(--color-hover-bg)] disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedOption ? (
          <span className="flex items-center gap-2" aria-hidden="true">
            <span className="flex h-5 w-7 items-center justify-center overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-background-secondary)]">
              <Image
                src={selectedOption.flagIcon}
                alt={selectedOption.flagAlt}
                width={28}
                height={20}
                className="h-5 w-7 object-cover"
              />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide">{selectedOption.codeLabel}</span>
          </span>
        ) : null}
        <span className="text-[var(--color-text-secondary)]">{selectedOption?.label}</span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-10 mt-2 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-xl">
          {options.map((option) => {
            const isActive = option.code === selectedLanguage;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => handleSelect(option.code)}
                className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-sm transition hover:bg-[var(--color-hover-bg)] ${
                  isActive
                    ? "text-[var(--color-accent-primary)]"
                    : "text-[var(--color-text-primary)]"
                }`}
                role="option"
                aria-selected={isActive}
              >
                <span className="flex items-center gap-2" aria-hidden="true">
                  <span className="flex h-5 w-7 items-center justify-center overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-background-secondary)]">
                    <Image
                      src={option.flagIcon}
                      alt={option.flagAlt}
                      width={28}
                      height={20}
                      className="h-5 w-7 object-cover"
                    />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide">{option.codeLabel}</span>
                </span>
                <span className="text-xs text-[var(--color-text-secondary)]">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default LanguageSelectField;
