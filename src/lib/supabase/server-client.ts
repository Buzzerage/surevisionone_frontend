/* eslint-disable @typescript-eslint/no-explicit-any */
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

const createServerInstance = async (): Promise<SupabaseClient> => {
  const { supabaseUrl, supabaseAnonKey } = resolveEnvironment();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet: any) {
        cookiesToSet.forEach(({ name, value, options }: any) => {
          cookieStore.set({ name, value, ...options });
        });
      },
    },
  });
};

export const createSupabaseServerClient = async () => await createServerInstance();

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
      setAll(cookiesToSet: any) {
        cookiesToSet.forEach(({ name, value }: any) => {
          req.cookies.set(name, value);
        });

        cookiesToSet.forEach(({ name, value, options }: any) => {
          res.cookies.set({ name, value, ...options });
        });
      },
    },
  });
};
