"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

import type { Arbitrage } from "../utils/types";

/**
 * Escucha cambios en la tabla `arbitrages` en tiempo real
 * y devuelve:
 *  - `arbitrages`: lista actual
 *  - `status`: "connecting" | "open" | "error"
 *  - `lastDelta`: ids de nuevos, actualizados y eliminados
 */
type RealtimeStatus = "connecting" | "open" | "error";

type ArbitrageDelta = {
  new: string[];
  updated: string[];
  deleted: string[];
};

export default function useArbitrageRealtime() {
  const [arbitrages, setArbitrages] = useState<Arbitrage[]>([]);
  const [status, setStatus] = useState<RealtimeStatus>("connecting");
  const [lastDelta, setLastDelta] = useState<ArbitrageDelta>({ new: [], updated: [], deleted: [] });

  const [retryCount, setRetryCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdate = useRef(Date.now());

  const scheduleRetry = useCallback(() => {
    if (retryTimerRef.current) return;
    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null;
      setRetryCount((attempt) => attempt + 1);
    }, 2000);
  }, []);

  const applyRealtimeChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Arbitrage>) => {
      const now = Date.now();
      if (now - lastUpdate.current < 100) return;
      lastUpdate.current = now;

      setArbitrages((prev) => {
        let updatedList = prev;
        const newIds: string[] = [];
        const updatedIds: string[] = [];
        const deletedIds: string[] = [];

        if (payload.eventType === "INSERT" && payload.new) {
          const record = payload.new as Arbitrage;
          const exists = prev.some((item) => item.id_arb === record.id_arb);
          updatedList = exists
            ? prev.map((item) => (item.id_arb === record.id_arb ? { ...item, ...record } : item))
            : [record, ...prev];
          if (exists) {
            updatedIds.push(record.id_arb);
          } else {
            newIds.push(record.id_arb);
          }
        } else if (payload.eventType === "UPDATE" && payload.new) {
          const record = payload.new as Arbitrage;
          const exists = prev.some((item) => item.id_arb === record.id_arb);
          updatedList = exists
            ? prev.map((item) => (item.id_arb === record.id_arb ? { ...item, ...record } : item))
            : [record, ...prev];
          updatedIds.push(record.id_arb);
        } else if (payload.eventType === "DELETE" && payload.old) {
          const record = payload.old as Arbitrage;
          updatedList = prev.filter((item) => item.id_arb !== record.id_arb);
          if (updatedList.length !== prev.length) {
            deletedIds.push(record.id_arb);
          }
        }

        if (newIds.length || updatedIds.length || deletedIds.length) {
          setLastDelta({ new: newIds, updated: updatedIds, deleted: deletedIds });
        }

        return updatedList;
      });
    },
    []
  );

  useEffect(() => {
    let isActive = true;

    const loadInitialData = async () => {
      const { data, error } = await supabase.from("arbitrages").select("*");
      if (!isActive) return;

      if (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error cargando arbitrajes iniciales:", error.message);
        }
        setStatus("error");
        scheduleRetry();
        return;
      }

      setArbitrages((data as Arbitrage[]) ?? []);
      setLastDelta({ new: [], updated: [], deleted: [] });
    };

    setStatus("connecting");
    loadInitialData();

    const channel = supabase
      .channel("arbitrages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "arbitrages" }, (payload) => {
        if (!isActive) return;
        applyRealtimeChange(payload as RealtimePostgresChangesPayload<Arbitrage>);
      })
      .subscribe((subscriptionStatus, err) => {
        if (!isActive) return;

        if (subscriptionStatus === "SUBSCRIBED") {
          setStatus("open");
          if (retryCount > 0) {
            loadInitialData();
          }
        } else if (subscriptionStatus === "CHANNEL_ERROR" || subscriptionStatus === "TIMED_OUT") {
          if (process.env.NODE_ENV !== "production" && err) {
            console.error("Error en canal realtime de arbitrajes:", err.message);
          }
          setStatus("error");
          scheduleRetry();
        } else if (subscriptionStatus === "CLOSED") {
          setStatus("connecting");
          scheduleRetry();
        }
      });

    channelRef.current = channel;

    return () => {
      isActive = false;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [retryCount, applyRealtimeChange, scheduleRetry]);

  return { arbitrages, status, lastDelta };
}
