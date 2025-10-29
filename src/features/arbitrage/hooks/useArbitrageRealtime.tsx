"use client";

import { useEffect, useRef, useState } from "react";

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

  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    const fetchInitial = async () => {
      setStatus("connecting");
      const { data, error } = await supabase.from("arbitrages").select("*");
      if (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error cargando arbitrajes iniciales:", error.message);
        }
        setStatus("error");
      } else {
        setArbitrages((data as Arbitrage[]) ?? []);
        setStatus("open");
      }
    };

    fetchInitial();

    // 🔁 Suscripción Realtime
    const channel = supabase
      .channel("arbitrages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "arbitrages" }, (payload) => {
        const now = Date.now();
        if (now - lastUpdate.current < 100) return; // Evita spam por cambios múltiples
        lastUpdate.current = now;

        setArbitrages((prev) => {
          let updatedList = [...prev];
          const newIds: string[] = [];
          const updatedIds: string[] = [];
          const deletedIds: string[] = [];

          switch (payload.eventType) {
            case "INSERT":
              updatedList = [payload.new as Arbitrage, ...prev];
              newIds.push((payload.new as Arbitrage).id_arb);
              break;

            case "UPDATE":
              updatedList = prev.map((a) =>
                a.id_arb === (payload.new as Arbitrage).id_arb
                  ? { ...a, ...(payload.new as Arbitrage) }
                  : a
              );
              updatedIds.push((payload.new as Arbitrage).id_arb);
              break;

            case "DELETE":
              updatedList = prev.filter((a) => a.id_arb !== (payload.old as Arbitrage).id_arb);
              deletedIds.push((payload.old as Arbitrage).id_arb);
              break;
          }

          setLastDelta({ new: newIds, updated: updatedIds, deleted: deletedIds });
          return updatedList;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { arbitrages, status, lastDelta };
}
