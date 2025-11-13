import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

const resolveEnvironment = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase server environment configuration");
  }

  return { supabaseUrl, supabaseAnonKey };
};

const createServerInstance = (): SupabaseClient => {
  const { supabaseUrl, supabaseAnonKey } = resolveEnvironment();
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set({ name, value, ...options });
        });
      },
      deleteAll(cookiesToDelete) {
        cookiesToDelete.forEach(({ name, options }) => {
          cookieStore.delete({ name, ...options });
        });
      },
    },
  });
};

export const createSupabaseServerClient = () => createServerInstance();

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
      deleteAll(cookiesToDelete) {
        for (const { name, options } of cookiesToDelete) {
          res.cookies.delete({ name, ...options });
        }
      },
    },
  });
};
