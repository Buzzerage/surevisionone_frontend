"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export default function useArbitrageWS() {
  const [arbitrages, setArbitrages] = useState<any[]>([]);
  const [status, setStatus] = useState<
    "connecting" | "open" | "closed" | "error" | "no-session"
  >("connecting");

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connectWS = useCallback(async () => {
    setStatus("connecting");

    try {
      // 1️⃣ Pedir ticket (cookie HttpOnly enviada automáticamente)
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/ws-ticket`, {
        method: "POST",
        credentials: "include",
      });
      if (!resp.ok) throw new Error("No se pudo obtener ticket");
      const { ticket } = await resp.json();

      // 2️⃣ Conectar WS con el ticket
      const WS_BASE =
        process.env.NEXT_PUBLIC_WS_BACKEND_URL ||
        process.env.NEXT_PUBLIC_WS_URL ||
        "wss://api.tuapp.com";

      const wsUrl = `${WS_BASE.replace(/\/$/, "")}/ws/arbitrages`;
      const ws = new WebSocket(wsUrl, ["jwt", btoa(ticket)]);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🟢 WS conectado (ticket válido)");
        setStatus("open");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg?.type === "initial" && Array.isArray(msg.data))
            setArbitrages(msg.data);
          else if (msg?.type === "delta" && Array.isArray(msg.data))
            setArbitrages((prev) => [...msg.data, ...prev]);
        } catch (e) {
          console.error("❌ Error parseando mensaje WS:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("🚨 Error WS:", err);
        setStatus("error");
      };

      ws.onclose = (evt) => {
        console.warn("🔴 WS cerrado", evt.code, evt.reason || "");
        wsRef.current = null;
        if (evt.code === 1008) setStatus("no-session");
        else {
          setStatus("closed");
          if (!reconnectTimeout.current) {
            reconnectTimeout.current = setTimeout(() => {
              reconnectTimeout.current = null;
              console.log("🔁 Reintentando WS…");
              connectWS();
            }, 5000);
          }
        }
      };
    } catch (err) {
      console.error("❌ Error conectando WS:", err);
      setStatus("no-session");
    }
  }, []);

  useEffect(() => {
    connectWS();
    return () => {
      wsRef.current?.close();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };
  }, [connectWS]);

  return { arbitrages, status };
}
