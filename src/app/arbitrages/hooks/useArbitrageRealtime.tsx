"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../components/supabaseClient";

/**
 * Escucha cambios en la tabla `arbitrages` en tiempo real
 * y devuelve:
 *  - `arbitrages`: lista actual
 *  - `status`: "connecting" | "open" | "error"
 *  - `lastDelta`: ids de nuevos, actualizados y eliminados
 */
export default function useArbitrageRealtime() {
  const [arbitrages, setArbitrages] = useState<any[]>([]);
  const [status, setStatus] = useState<"connecting" | "open" | "error">("connecting");
  const [lastDelta, setLastDelta] = useState<{ new: string[]; updated: string[]; deleted: string[] }>({
    new: [],
    updated: [],
    deleted: [],
  });

  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    const fetchInitial = async () => {
      setStatus("connecting");
      const { data, error } = await supabase.from("arbitrages").select("*");
      if (error) {
        console.error("❌ Error cargando arbitrajes iniciales:", error.message);
        setStatus("error");
      } else {
        setArbitrages(data || []);
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
          let newIds: string[] = [];
          let updatedIds: string[] = [];
          let deletedIds: string[] = [];

          switch (payload.eventType) {
            case "INSERT":
              updatedList = [payload.new, ...prev];
              newIds.push(payload.new.id_arb);
              break;

            case "UPDATE":
              updatedList = prev.map((a) =>
                a.id_arb === payload.new.id_arb ? { ...a, ...payload.new } : a
              );
              updatedIds.push(payload.new.id_arb);
              break;

            case "DELETE":
              updatedList = prev.filter((a) => a.id_arb !== payload.old.id_arb);
              deletedIds.push(payload.old.id_arb);
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
