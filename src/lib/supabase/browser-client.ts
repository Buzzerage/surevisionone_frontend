"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  var __SUPABASE_BROWSER_CLIENT__: SupabaseClient | undefined;
}

const resolveEnvironment = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase browser environment configuration");
  }

  return { supabaseUrl, supabaseAnonKey };
};

export const getSupabaseBrowserClient = (): SupabaseClient => {
  if (!globalThis.__SUPABASE_BROWSER_CLIENT__) {
    const { supabaseUrl, supabaseAnonKey } = resolveEnvironment();

    globalThis.__SUPABASE_BROWSER_CLIENT__ = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: "implicit",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    });
  }

  return globalThis.__SUPABASE_BROWSER_CLIENT__;
};

export const supabase = getSupabaseBrowserClient();
