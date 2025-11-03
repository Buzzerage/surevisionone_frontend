"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations, SupportedLanguage } from "./translations";
import { supabase } from "../components/supabaseClient";

type TranslationValue = any; // eslint-disable-line @typescript-eslint/no-explicit-any

type TranslationParams = Record<string, string | number>;

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage, options?: { syncProfile?: boolean }) => Promise<void>;
  t: (key: string, params?: TranslationParams) => TranslationValue;
  availableLanguages: { code: SupportedLanguage; label: string; flag: string }[];
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const SPANISH_REGION_CODES = [
  "ES",
  "MX",
  "AR",
  "CO",
  "PE",
  "CL",
  "VE",
  "UY",
  "PY",
  "BO",
  "CR",
  "PA",
  "DO",
  "HN",
  "GT",
  "NI",
  "SV",
  "PR",
  "CU",
  "EC",
];

const LANGUAGE_STORAGE_KEY = "preferred-language";

const getStoredLanguage = (): SupportedLanguage | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "en" || stored === "es") return stored;
  return null;
};

const detectLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return "en";
  }

  const locale = window.navigator?.language || "en";
  const [languageCode, regionCode] = locale.split("-");
  if (languageCode?.toLowerCase() === "es") {
    return "es";
  }
  if (regionCode && SPANISH_REGION_CODES.includes(regionCode.toUpperCase())) {
    return "es";
  }
  return "en";
};

type ProfileLanguageRow = {
  language?: string | null;
};

const fetchProfileLanguage = async (): Promise<SupportedLanguage | null> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session?.user?.id) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("language")
      .eq("auth_user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.warn("⚠️ Unable to read profile language:", error.message);
      return null;
    }

    const languageRow = data as ProfileLanguageRow | null;
    const value = languageRow?.language;
    if (value === "en" || value === "es") {
      return value;
    }
    return null;
  } catch (err) {
    console.warn("⚠️ Error loading profile language:", err);
    return null;
  }
};

const persistLanguageSelection = async (language: SupportedLanguage) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({ language })
      .eq("auth_user_id", session.user.id);

    if (error) {
      console.warn("⚠️ Unable to persist language preference:", error.message);
    }
  } catch (err) {
    console.warn("⚠️ Error persisting language preference:", err);
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    let active = true;

    const initialiseLanguage = async () => {
      const storedLanguage = getStoredLanguage();
      if (storedLanguage) {
        if (active) setLanguageState(storedLanguage);
        return;
      }

      const profileLanguage = await fetchProfileLanguage();
      if (profileLanguage) {
        if (active) {
          setLanguageState(profileLanguage);
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, profileLanguage);
        }
        return;
      }

      const detected = detectLanguage();
      if (active) {
        setLanguageState(detected);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, detected);
        }
      }
    };

    initialiseLanguage();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const translate = useCallback(
    (key: string, params?: TranslationParams): TranslationValue => {
      const segments = key.split(".");
      let node: TranslationValue = translations[language];
      for (const segment of segments) {
        if (node && typeof node === "object" && segment in node) {
          node = node[segment];
        } else {
          node = undefined;
          break;
        }
      }

      if (typeof node === "string") {
        if (!params) return node;
        return Object.keys(params).reduce((acc, paramKey) => {
          const value = params[paramKey];
          return acc.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, "g"), String(value));
        }, node);
      }

      return node ?? key;
    },
    [language]
  );

  const setLanguage = useCallback(
    async (newLanguage: SupportedLanguage, options?: { syncProfile?: boolean }) => {
      setLanguageState(newLanguage);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      }
      const shouldSync = options?.syncProfile ?? true;
      if (shouldSync) {
        await persistLanguageSelection(newLanguage);
      }
    },
    []
  );

  const availableLanguages = useMemo(
    () => [
      { code: "es" as SupportedLanguage, label: translate("common.languageNames.es") as string, flag: "🇪🇸" },
      { code: "en" as SupportedLanguage, label: translate("common.languageNames.en") as string, flag: "🇬🇧" },
    ],
    [translate]
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, t: translate, availableLanguages }),
    [language, setLanguage, translate, availableLanguages]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

