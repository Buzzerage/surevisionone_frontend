"use client";

import type { AuthError, SupabaseClient } from "@supabase/supabase-js";

const parseNumber = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const stripHashFromUrl = (stripSearch = false) => {
  if (typeof window === "undefined") return;

  const { pathname, search } = window.location;
  const nextSearch = stripSearch ? "" : search;
  window.history.replaceState({}, document.title, `${pathname}${nextSearch}`);
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

  const { hash, search } = window.location;

  // Recovery links may hit the app with token & type in the query string
  const searchParams = new URLSearchParams(search);
  const recoveryToken = searchParams.get("token") ?? searchParams.get("token_hash");
  const recoveryType = searchParams.get("type");

  if (recoveryToken && recoveryType === "recovery") {
    const { error } = await client.auth.verifyOtp({
      type: "recovery",
      token_hash: recoveryToken,
    });

    if (!error) {
      stripHashFromUrl(true);
    }

    return { processed: true, error };
  }

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
