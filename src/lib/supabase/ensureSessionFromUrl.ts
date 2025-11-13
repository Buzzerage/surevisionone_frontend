"use client";

import type { AuthError, SupabaseClient } from "@supabase/supabase-js";

const parseNumber = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const stripHashFromUrl = () => {
  if (typeof window === "undefined") return;

  const { pathname, search } = window.location;
  window.history.replaceState({}, document.title, `${pathname}${search}`);
};

export type EnsureSessionFromUrlResult = {
  processed: boolean;
  error?: AuthError | null;
};

export const ensureSessionFromUrl = async (
  client: SupabaseClient
): Promise<EnsureSessionFromUrlResult> => {
  if (typeof window === "undefined") {
    return { processed: false };
  }

  const { hash } = window.location;
  if (!hash || hash.length <= 1) {
    return { processed: false };
  }

  const params = new URLSearchParams(hash.slice(1));
  const type = params.get("type");

  if (type && type !== "recovery" && type !== "signup" && type !== "magiclink") {
    return { processed: false };
  }

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return { processed: false };
  }

  const expiresIn = parseNumber(params.get("expires_in"));
  const expiresAt = parseNumber(params.get("expires_at"));
  const tokenType = params.get("token_type") ?? undefined;
  const providerToken = params.get("provider_token") ?? undefined;
  const providerRefreshToken = params.get("provider_refresh_token") ?? undefined;

  const { error } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    expires_at: expiresAt,
    token_type: tokenType,
    provider_token: providerToken,
    provider_refresh_token: providerRefreshToken,
  });

  if (!error) {
    stripHashFromUrl();
  }

  return { processed: true, error };
};
