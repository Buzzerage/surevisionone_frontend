"use client"; // Hook usa useState y useEffect

import { useEffect, useState, useRef } from "react";

export default function useArbitrageWS(url) {
  const [arbitrages, setArbitrages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => console.log("WebSocket connected");

    wsRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "initial") {
        setArbitrages(msg.data);
      } else if (msg.type === "delta") {
        setArbitrages((prev) => {
          let updated = [...prev];

          // Nuevos
          msg.new?.forEach((arb) => updated.push(arb));

          // Actualizados
          msg.updated?.forEach((upd) => {
            const idx = updated.findIndex((a) => a.id_arb === upd.id_arb);
            if (idx !== -1) updated[idx] = { ...updated[idx], ...upd };
          });

          // Eliminados
          msg.deleted?.forEach((del) => {
            updated = updated.filter((a) => a.id_arb !== del.id_arb);
          });

          // Ordenar por profit
          updated.sort((a, b) => b.profit_percent - a.profit_percent);

          return updated;
        });
      }
    };

    wsRef.current.onclose = () => console.log("WebSocket disconnected");

    return () => {
      wsRef.current.close();
    };
  }, [url]);

  return arbitrages;
}
