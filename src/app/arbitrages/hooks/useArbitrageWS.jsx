"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../components/supabaseClient"; // Ajusta la ruta

export default function useArbitrageWS() {
  const [arbitrages, setArbitrages] = useState([]);
  const [status, setStatus] = useState("connecting"); // "open" | "closed" | "error" | "connecting"
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  const connectWS = useCallback(async () => {
    try {
      setStatus("connecting");

      // 🔐 Obtener sesión actual de Supabase
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      const token = session?.access_token;
      if (!token) {
        console.warn("⚠️ No hay sesión activa. No se puede conectar al WS.");
        setStatus("error");
        return;
      }

      const WS_URL = process.env.NEXT_PUBLIC_WS_BACKEND_URL;
      if (!WS_URL) {
        console.error("❌ Falta NEXT_PUBLIC_WS_BACKEND_URL en .env.local");
        setStatus("error");
        return;
      }

      // ⚙️ Crear conexión WebSocket
      // 🟢 NOTA: usamos el token en header Sec-WebSocket-Protocol en lugar de query param.
      const ws = new WebSocket(WS_URL, [btoa(token)]);
      wsRef.current = ws;

      // 🟢 Conectado
      ws.onopen = () => {
        console.log("🟢 WebSocket conectado correctamente");
        setStatus("open");
      };

      // 📩 Datos recibidos
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "initial" && msg.data) {
            console.log("📥 Estado inicial recibido:", msg.data.length, "items");
            setArbitrages(msg.data);
          } else if (msg.type === "delta" && msg.data) {
            setArbitrages((prev) => [...msg.data, ...prev]);
          } else {
            console.log("📡 Mensaje WS desconocido:", msg);
          }
        } catch (err) {
          console.error("❌ Error procesando mensaje WS:", err);
        }
      };

      // ⚠️ Error
      ws.onerror = (err) => {
        console.error("🚨 Error en WebSocket:", err);
        setStatus("error");
      };

      // 🔴 Cerrado
      ws.onclose = () => {
        console.warn("🔴 WebSocket desconectado");
        setStatus("closed");

        // 🔁 Reintento automático
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

      if (!reconnectTimeout.current) {
        reconnectTimeout.current = setTimeout(() => {
          reconnectTimeout.current = null;
          connectWS();
        }, 10000);
      }
    }
  }, []);

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
