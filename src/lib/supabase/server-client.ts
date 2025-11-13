import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

const resolveEnvironment = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase server environment configuration");
  }

  return { supabaseUrl, supabaseAnonKey };
};

const buildServerCookiesAdapter = () => {
  const cookieStore = cookies();

  return {
    getAll() {
      return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
    },
  };
};

const createServerInstance = (): SupabaseClient => {
  const { supabaseUrl, supabaseAnonKey } = resolveEnvironment();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: buildServerCookiesAdapter(),
  });
};

export const getSupabaseServerClient = cache(createServerInstance);
export const createSupabaseServerClient = () => getSupabaseServerClient();

export const createSupabaseMiddlewareClient = (
  req: NextRequest,
  res: NextResponse
): SupabaseClient => {
  const { supabaseUrl, supabaseAnonKey } = resolveEnvironment();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          res.cookies.set({ name, value, ...options });
        }
      },
    },
  });
};
