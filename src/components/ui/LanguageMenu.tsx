"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useLanguageContext } from "@/providers/LanguageProvider";

type LanguageMenuProps = {
  className?: string;
};

const LanguageMenu = ({ className }: LanguageMenuProps) => {
  const { language, setLanguage, options, loading } = useLanguageContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const current = options.find((item) => item.code === language) ?? options[0];

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
        className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-accent)] shadow-sm transition hover:bg-[var(--color-hover-bg)]"
      >
        <span className="text-lg leading-none" aria-hidden="true">
          {current?.flag}
        </span>
        <span className="hidden sm:inline">{current?.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-40 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-lg">
          {options.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => {
                setOpen(false);
                void setLanguage(option.code);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-[var(--color-hover-bg)] ${
                option.code === language ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-primary)]"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {option.flag}
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageMenu;
