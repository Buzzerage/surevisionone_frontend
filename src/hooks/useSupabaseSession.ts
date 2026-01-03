"use client";

import { useState, useEffect } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/browser-client";

type UseSupabaseSessionResult = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: AuthError | null;
};

export function useSupabaseSession(): UseSupabaseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const currentSession = data.session ?? null;
        if (!active) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setError(null);
      } catch (err) {
        if (!active) return;
        const authError = err as AuthError;
        if (process.env.NODE_ENV !== "production") {
          console.error("Error obteniendo sesión de Supabase", authError);
        }
        setError(authError);
        setSession(null);
        setUser(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!active) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "INITIAL_SESSION" ||
        event === "PASSWORD_RECOVERY"
      ) {
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, error };
}
