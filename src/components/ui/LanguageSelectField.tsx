"use client";

import type { ChangeEvent } from "react";

import { useLanguageContext } from "@/providers/LanguageProvider";
import type { LanguageCode } from "@/lib/i18n/language";

type LanguageSelectFieldProps = {
  className?: string;
};

const LanguageSelectField = ({ className }: LanguageSelectFieldProps) => {
  const { language, setLanguage, options, loading } = useLanguageContext();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.target.value as LanguageCode;
    void setLanguage(nextLanguage);
  };

  return (
    <div className={`mt-1 ${className ?? ""}`}>
      <select
        value={language}
        onChange={handleChange}
        disabled={loading}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-2 text-sm font-medium text-[var(--color-text-accent)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {`${option.flag} ${option.label}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelectField;
