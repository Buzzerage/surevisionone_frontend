"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type SupabaseAuthInternals = {
  _removeSession?: () => Promise<void>;
  storageKey?: string;
  storage?: {
    removeItem?: (key: string) => Promise<void> | void;
  };
};

const runSafe = async (operation: (() => Promise<void> | void) | undefined) => {
  if (!operation) return;

  try {
    await operation();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("No se pudo limpiar una clave de sesión", error);
    }
  }
};

export const clearSupabaseSession = async (client?: SupabaseClient) => {
  const resolvedClient = client ?? getSupabaseBrowserClient();
  const auth = resolvedClient.auth as unknown as SupabaseAuthInternals;

  if (auth?._removeSession) {
    await auth._removeSession();
    const storage = auth.storage;
    const storageKey = auth.storageKey;

    if (storage && storageKey) {
      const removeItem = storage.removeItem?.bind(storage);
      await Promise.allSettled([
        runSafe(() => removeItem?.(`${storageKey}-code-verifier`)),
        runSafe(() => removeItem?.(`${storageKey}-user`)),
      ]);
    }
    return;
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem("sb-session");
      window.localStorage.removeItem("sb-session-code-verifier");
      window.localStorage.removeItem("sb-session-user");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("No se pudo limpiar la sesión local de Supabase", error);
      }
    }
  }
};
