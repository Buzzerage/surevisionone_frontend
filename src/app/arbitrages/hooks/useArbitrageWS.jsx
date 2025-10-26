"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../components/supabaseClient"; // Ajusta la ruta si cambia

export default function useArbitrageWS() {
  const [arbitrages, setArbitrages] = useState([]);
  const [status, setStatus] = useState("connecting"); // "open" | "closed" | "error" | "connecting"
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  // 🧠 Función para establecer la conexión WebSocket
  const connectWS = useCallback(async () => {
    try {
      setStatus("connecting");

      // ✅ 1. Obtener sesión actual de Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      const token = session?.access_token;
      if (!token) {
        console.warn("⚠️ No se encontró sesión activa de Supabase. No se puede conectar al WS.");
        setStatus("error");
        return;
      }

      // ✅ 2. Leer URL del backend desde .env
      const WS_URL = process.env.NEXT_PUBLIC_WS_BACKEND_URL;
      if (!WS_URL) {
        console.error("❌ NEXT_PUBLIC_WS_BACKEND_URL no está definida en .env.local");
        setStatus("error");
        return;
      }

      // ✅ 3. Conectar al WebSocket con token en query
      const wsFullUrl = `${WS_URL}?token=${token}`;
      console.log("🔌 Conectando WebSocket:", wsFullUrl);

      const ws = new WebSocket(wsFullUrl);
      wsRef.current = ws;

      // 🟢 Evento: conexión abierta
      ws.onopen = () => {
        console.log("🟢 WebSocket conectado correctamente");
        setStatus("open");
      };

      // 📦 Evento: recepción de datos
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "initial" && msg.data) {
            console.log("📥 Estado inicial recibido:", msg.data.length, "items");
            setArbitrages(msg.data);
            console.log("🧩 Primer arbitraje recibido:", msg.data[0]);
          } else if (msg.type === "delta" && msg.data) {
            console.log("⚡ Delta recibido:", msg.data.length, "items nuevos");
            setArbitrages((prev) => [...msg.data, ...prev]);
          } else {
            console.log("📡 Mensaje WS no reconocido:", msg);
          }
        } catch (err) {
          console.error("❌ Error procesando mensaje WS:", err);
        }
      };

      // 🚨 Evento: error en WS
      ws.onerror = (err) => {
        console.error("🚨 Error en WebSocket:", err);
        setStatus("error");
      };

      // 🔴 Evento: desconexión WS
      ws.onclose = () => {
        console.warn("🔴 WebSocket desconectado");
        setStatus("closed");

        // 🔁 Intentar reconectar automáticamente tras 5 segundos
        if (!reconnectTimeout.current) {
          reconnectTimeout.current = setTimeout(() => {
            console.log("🔁 Reintentando conexión WebSocket...");
            reconnectTimeout.current = null;
            connectWS();
          }, 5000);
        }
      };

    } catch (err) {
      console.error("❌ Error estableciendo conexión WS:", err);
      setStatus("error");

      // Intentar reconectar después de 10s si falla el intento inicial
      if (!reconnectTimeout.current) {
        reconnectTimeout.current = setTimeout(() => {
          reconnectTimeout.current = null;
          connectWS();
        }, 10000);
      }
    }
  }, []);

  // 🧹 Limpieza al desmontar el hook
  useEffect(() => {
    connectWS();

    return () => {
      if (wsRef.current) {
        console.log("🧹 Cerrando WebSocket");
        wsRef.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connectWS]);

  return { arbitrages, status };
}
