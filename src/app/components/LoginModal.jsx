import React, { useState } from "react";
import { X, Mail, Lock, CheckCircle, Loader } from "lucide-react";
import { supabase } from "./supabaseClient";

// Componente de Carga y Éxito Moderno
const LoadingScreen = ({ status }) => {
  const icon = status === 'success' ? (
    <CheckCircle className="w-16 h-16 text-green-500 animate-in fade-in zoom-in" />
  ) : (
    <Loader className="w-16 h-16 text-[var(--color-accent-primary)] animate-spin" />
  );

  const message = status === 'success' 
    ? "¡Listo! Redirigiendo a tu dashboard..." 
    : "Validando credenciales. Por favor, espera...";

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] py-10 transition-opacity duration-500 ease-in-out">
      {icon}
      <h3 className="mt-6 text-xl font-semibold text-[var(--color-text-accent)]">
        {status === 'success' ? "Inicio Exitoso" : "Iniciando Sesión"}
      </h3>
      <p className="mt-2 text-[var(--color-text-secondary)] text-center max-w-xs">{message}</p>
    </div>
  );
};

// Normaliza mensajes de error de Supabase
const handleSupabaseError = (error) => {
    if (!error) return "";
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("password") || msg.includes("short")) return "Mínimo 8 caracteres, con mayúscula, minúscula, dígito y símbolo.";
    if (msg.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
    if (msg.includes("email not confirmed")) return "Debes confirmar tu correo antes de iniciar sesión.";
    if (msg.includes("registered") || msg.includes("user already exists")) return "Este correo ya está registrado.";
    if (msg.includes("email address") || msg.includes("invalid email")) return "El formato del correo electrónico no es válido.";
    if (msg.includes("network") || msg.includes("fetch")) return "Error de conexión. Verifica tu red.";
    return `Error: ${error.message}`;
};

export default function LoginModal({ onClose, onAuthSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    
    // 1. Establecer loading a true ANTES de la llamada a la API
    setLoading(true);

    try {
      let response;
      if (isRegistering) {
        response = await supabase.auth.signUp({ email, password });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      const { data, error } = response;
      
      // 2. Si hay error, detener la carga y mostrar el error
      if (error) {
        setLoading(false);
        setError(handleSupabaseError(error));
        return;
      }

      if (isRegistering) {
        setLoading(false); // Detener carga solo para registro (no redirige)
        setSuccess("Registro completado. Revisa tu correo para confirmar tu cuenta.");
      } else if (data?.session) {
        // Lógica de éxito en el login
        const { access_token } = data.session;
        const secureFlag = window.location.protocol === "https:" ? "Secure;" : "";
        document.cookie = `sb-access-token=${access_token}; Path=/; Max-Age=3600; SameSite=Lax; ${secureFlag}`;
        
        // 3. Establecer éxito (esto activa el estado 'success' en LoadingScreen)
        setLoginSuccessful(true);
        onAuthSuccess?.(data.session);
        
        // 4. Redirección después de la animación
        setTimeout(() => {
            onClose(); 
            window.location.replace('/arbitrage');
        }, 1800); 
        
        // No necesitamos setear setLoading(false) aquí, ya que la redirección recarga la página.
      }
    } catch (err) {
      console.error("Error inesperado en handleSubmit:", err);
      setLoading(false);
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    }
  };

  // 5. Renderizado condicional para mostrar la pantalla de carga
  const isTransitioning = loading || loginSuccessful;

  const content = isTransitioning ? (
    <LoadingScreen status={loginSuccessful ? "success" : "loading"} />
  ) : (
    // Formulario de login/registro (solo si no estamos cargando o en éxito)
    <>
        <h2 className="text-3xl font-bold mb-2 text-[var(--color-text-accent)] text-center">
            {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6 text-center">
            Accede a tus oportunidades de arbitraje.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border text-[var(--color-text-accent)] bg-[var(--color-background-secondary)] border-[var(--color-input-border)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all"
                    disabled={false} // Mantener habilitado, el spinner del botón es el feedback
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border text-[var(--color-text-accent)] bg-[var(--color-background-secondary)] border-[var(--color-input-border)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all"
                    disabled={false} // Mantener habilitado
                />
            </div>

            {error && (
                <p className="text-sm text-center text-[var(--color-red-text)] font-medium p-2 rounded-lg bg-[var(--color-subtle-bg)]">
                    {error}
                </p>
            )}

            {success && isRegistering && (
                <p className="text-sm text-center text-green-500 font-medium p-2 rounded-lg bg-[var(--color-subtle-bg)]">
                    {success}
                </p>
            )}

            <button
                type="submit"
                className="w-full py-3 text-white rounded-lg bg-[var(--color-accent-primary)] hover:bg-[#0ea5e9] transition-colors font-semibold"
                disabled={loading} // El botón se deshabilita si está cargando
            >
                {loading ? <Loader className="w-5 h-5 mx-auto animate-spin" /> : isRegistering ? "Registrarse" : "Iniciar Sesión"}
            </button>
            
            <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
                {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                <button
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError("");
                        setSuccess("");
                    }}
                    className="text-[var(--color-accent-primary)] font-medium hover:underline"
                >
                    {isRegistering ? "Inicia Sesión" : "Regístrate"}
                </button>
            </p>
    </form>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={isTransitioning ? (e) => e.stopPropagation() : onClose} // Evitar cerrar si está cargando/exitoso
    >
      <div
        className="w-full max-w-md p-8 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-2xl relative transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors ${isTransitioning ? 'opacity-0 pointer-events-none' : ''}`}
          aria-label="Cerrar modal"
          disabled={isTransitioning}
        >
          <X className="w-6 h-6" />
        </button>
        
        {content}

      </div>
    </div>
  );
}