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
    let mounted = true;

    const init = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (mounted) {
          if (sessionError) throw sessionError;

          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as AuthError);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, error };
}
