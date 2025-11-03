"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/client";

export type LanguageCode = "es" | "en";

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  flag: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => Promise<void>;
  loading: boolean;
  options: LanguageOption[];
};

const STORAGE_KEY = "preferred-language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const normalizeLanguage = (value: unknown): LanguageCode => {
  if (value === "es") return "es";
  return "en";
};

const detectBrowserLanguage = (): LanguageCode => {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const browserLanguages = Array.isArray(navigator.languages)
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : [];

  const firstMatch = browserLanguages.find((entry) => entry.toLowerCase().startsWith("es"));
  return firstMatch ? "es" : "en";
};

const readStoredLanguage = (): LanguageCode | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? normalizeLanguage(stored) : null;
};

const persistLanguageLocally = (code: LanguageCode) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, code);
  }
};

const applyLanguageToDocument = (code: LanguageCode) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", code);
  }
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }
  return context;
};

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = readStoredLanguage();
    if (stored) return stored;
    const detected = detectBrowserLanguage();
    applyLanguageToDocument(detected);
    return detected;
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    applyLanguageToDocument(language);
    persistLanguageLocally(language);
  }, [language]);

  useEffect(() => {
    let active = true;

    const fetchProfileLanguage = async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("language")
          .eq("id", id)
          .limit(1);

        if (!active) return;

        if (!error && data && data.length > 0 && data[0]?.language) {
          const normalized = normalizeLanguage(data[0].language);
          setLanguageState(normalized);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("No se pudo obtener el idioma del perfil", error);
        }
      }
    };

    const initialize = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (user) {
          setUserId(user.id);
          await fetchProfileLanguage(user.id);
        } else {
          setUserId(null);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("No se pudo inicializar el idioma del usuario", error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void initialize();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;

      if (session?.user) {
        setUserId(session.user.id);
        await fetchProfileLanguage(session.user.id);
      } else {
        setUserId(null);
        const fallback = readStoredLanguage() ?? detectBrowserLanguage();
        setLanguageState(fallback);
      }
    });

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const handleSetLanguage = useCallback(
    async (code: LanguageCode) => {
      setLanguageState(code);

      if (!userId) return;

      try {
        const { error } = await supabase
          .from("profiles")
          .update({ language: code })
          .eq("id", userId);

        if (error && process.env.NODE_ENV !== "production") {
          console.warn("No se pudo actualizar el idioma en el perfil", error);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Error inesperado al guardar el idioma", error);
        }
      }
    },
    [userId]
  );

  const value = useMemo<LanguageContextType>(
    () => ({ language, setLanguage: handleSetLanguage, loading, options: LANGUAGE_OPTIONS }),
    [handleSetLanguage, language, loading]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
