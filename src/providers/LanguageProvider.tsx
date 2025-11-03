"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import { getLanguageOptions } from "@/lib/i18n";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/language";

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  codeLabel: string;
  flag: string;
};

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => Promise<void>;
  saveLanguagePreference: (
    code?: LanguageCode,
    profileOverrides?: Record<string, unknown>
  ) => Promise<void>;
  loading: boolean;
  options: LanguageOption[];
};

const STORAGE_KEY = "preferred-language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const normalizeLanguage = (value: unknown): LanguageCode => {
  if (value === "es") return "es";
  return DEFAULT_LANGUAGE;
};

const detectBrowserLanguage = (): LanguageCode => {
  if (typeof navigator === "undefined") {
    return DEFAULT_LANGUAGE;
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
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const languageOptions = useMemo(() => getLanguageOptions(language), [language]);

  useEffect(() => {
    applyLanguageToDocument(language);
    persistLanguageLocally(language);
  }, [language]);

  useEffect(() => {
    let active = true;

    const determineLocalLanguage = () => {
      const stored = readStoredLanguage();
      const fallback = stored ?? detectBrowserLanguage();
      return normalizeLanguage(fallback);
    };

    const applyLocalLanguage = () => {
      const resolved = determineLocalLanguage();
      if (active) {
        setLanguageState(resolved);
      }
      return resolved;
    };

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
      applyLocalLanguage();

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
        applyLocalLanguage();
      }
    });

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const handleSetLanguage = useCallback(async (code: LanguageCode) => {
    setLanguageState(code);
  }, []);

  const handleSaveLanguage = useCallback(
    async (code?: LanguageCode, profileOverrides?: Record<string, unknown>) => {
      const nextLanguage = code ?? language;

      if (!userId) {
        return;
      }

      try {
        const { error } = await supabase
          .from("profiles")
          .upsert(
            { id: userId, language: nextLanguage, ...(profileOverrides ?? {}) },
            { onConflict: "id", returning: "minimal" }
          );

        if (error) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("No se pudo actualizar el idioma en el perfil", error);
          }
          throw new Error(error.message ?? "Unable to update profile language");
        }

        const { error: metadataError } = await supabase.auth.updateUser({
          data: { language: nextLanguage, ...(profileOverrides ?? {}) },
        });

        if (metadataError) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("No se pudo sincronizar el idioma del usuario", metadataError);
          }
          throw new Error(metadataError.message ?? "Unable to sync user language");
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Error inesperado al guardar el idioma", error);
        }
        throw error;
      }
    },
    [language, userId]
  );

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      saveLanguagePreference: handleSaveLanguage,
      loading,
      options: languageOptions,
    }),
    [handleSaveLanguage, handleSetLanguage, language, languageOptions, loading]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
