import React, { useState, useEffect } from 'react';
// ✅ CORRECCIÓN: Los iconos de Lucide deben importarse con PascalCase (ej: Zap en lugar de zap).
import { Zap, TrendingUp, Shield, DollarSign, CreditCard, Rocket, Users, Check, Star, Clock, Maximize, LogIn, Sun, Moon, LogOut, X, Mail, Lock } from 'lucide-react';
const AUTH_URL = 'http://127.0.0.1:5001/auth';

// --- Estado del Tema (Claro/Oscuro) y Simulación de Autenticación ---

const useTheme = () => {
    const [theme, setTheme] = useState('dark'); // dark (oscuro) o light (claro)

    useEffect(() => {
        // Inicializa el tema basándose en localStorage o predeterminado
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
        document.documentElement.style.setProperty('--color-background-primary', savedTheme === 'dark' ? '#0d111c' : '#ffffff');
        document.documentElement.style.setProperty('--color-background-secondary', savedTheme === 'dark' ? '#161b22' : '#f0f4f8');
        document.documentElement.style.setProperty('--color-background-tertiary', savedTheme === 'dark' ? '#21262d' : '#e0e4e8');
        document.documentElement.style.setProperty('--color-text-primary', savedTheme === 'dark' ? '#f0f6fc' : '#1c2128');
        document.documentElement.style.setProperty('--color-text-secondary', savedTheme === 'dark' ? '#8b949e' : '#57606a');
        document.documentElement.style.setProperty('--color-text-accent', savedTheme === 'dark' ? '#c9d1d9' : '#1c2128');
        document.documentElement.style.setProperty('--color-accent-primary', '#1e90ff'); // Azul vibrante
        document.documentElement.style.setProperty('--color-green-text', '#3fb950'); // Verde para ganancias
        document.documentElement.style.setProperty('--color-red-text', '#f85149'); // Rojo para pérdidas/riesgo
        document.documentElement.style.setProperty('--color-card-bg', savedTheme === 'dark' ? '#1f242b' : '#ffffff');
        document.documentElement.style.setProperty('--color-border', savedTheme === 'dark' ? '#30363d' : '#d0d7de');
        document.documentElement.style.setProperty('--color-subtle-bg', savedTheme === 'dark' ? '#2d333b' : '#f6f8fa');
        document.documentElement.style.setProperty('--color-hover-bg', savedTheme === 'dark' ? '#3e444b' : '#e8ebed');
        document.documentElement.style.setProperty('--color-input-border', savedTheme === 'dark' ? '#444c56' : '#c9d1d9');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return { theme, toggleTheme };
};

// Componente de la Barra de Navegación (Header)
const Header = ({ theme, toggleTheme, onLogin, onLogout, user }) => {
    const ThemeIcon = theme === 'dark' ? Sun : Moon;

    return (
        <header className="fixed top-0 left-0 w-full z-10 bg-[var(--color-background-primary)] shadow-md border-b border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo / Nombre del sitio */}
                <span className="text-2xl font-bold text-[var(--color-accent-primary)] cursor-pointer">
                    ArbitrageFlow
                </span>
                
                {/* Navegación y Acciones */}
                <nav className="flex items-center space-x-4">
                    <a href="#features" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors text-sm font-medium hidden md:block">
                        Características
                    </a>
                    <a href="#pricing" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors text-sm font-medium hidden md:block">
                        Precios
                    </a>

                    {/* Botón de Login/Logout */}
                    <button
                        onClick={user ? onLogout : onLogin}
                        className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors 
                            ${user 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9]'
                            }`}
                    >
                        {user ? (
                            <>
                                <LogOut className="w-4 h-4" />
                                <span>Cerrar Sesión</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                <span>Iniciar Sesión</span>
                            </>
                        )}
                    </button>

                    {/* Toggle del Tema */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-[var(--color-background-tertiary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)] transition-colors"
                        aria-label="Toggle theme"
                    >
                        <ThemeIcon className="w-5 h-5" />
                    </button>
                </nav>
            </div>
        </header>
    );
};

// --- Componentes de Datos y Lógica (Sin cambios) ---

// Constantes de datos (Mock data para la demo)
const FEATURES = [
  { 
    title: "Arbitraje en Tiempo Real", 
    description: "Escaneo ultrarrápido a través de más de 80 casas de apuestas y exchanges para no perderte ni una oportunidad.", 
    icon: Zap 
  },
  { 
    title: "Seguimiento de Beneficios", 
    description: "Visualiza tus ganancias y pérdidas históricas, rendimiento por deporte y análisis detallado de ROI.", 
    icon: TrendingUp 
  },
  { 
    title: "Seguridad y Transparencia", 
    description: "Cálculos verificados y encriptación de datos para garantizar la seguridad de tu información financiera.", 
    icon: Shield 
  },
  { 
    title: "Calculadora Integrada", 
    description: "Ajusta automáticamente las apuestas 'back' y 'lay' basándose en tu bankroll disponible.", 
    icon: Maximize 
  },
];

// ✅ MODIFICACIÓN: Se ha añadido el plan 'Free' al inicio de la lista
const PRICING_PLANS = [
  {
    name: "Free",
    price: "€0",
    tagline: "Acceso permanente a la plataforma con arbitrajes básicos.",
    features: [
      "Escaneo en 5 casas de apuestas",
      "Arbitrajes con beneficio > 3.0%",
      "Retraso de datos de 30 minutos",
      "Soporte por documentación",
    ],
    isPopular: false,
    isFree: true, // Nuevo flag para el plan gratuito
  },
  {
    name: "Starter",
    price: "€29",
    tagline: "Ideal para principiantes que empiezan a explorar el arbitraje.",
    features: [
      "Escaneo en 20+ casas de apuestas",
      "Arbitrajes con beneficio > 1.5%",
      "Notificaciones por email",
      "Soporte Estándar",
    ],
    isPopular: false,
  },
  {
    name: "Pro",
    price: "€99",
    tagline: "Herramientas avanzadas para arbitrajistas a tiempo parcial.",
    features: [
      "Escaneo en 80+ casas de apuestas",
      "Arbitrajes con beneficio > 0%",
      "Notificaciones instantáneas (SMS/Telegram)",
      "Calculadora de Arbitraje avanzada",
      "Soporte Premium 24/7",
    ],
    isPopular: true,
  },
  {
    name: "Ultimate",
    price: "€199",
    tagline: "Máxima velocidad y acceso a arbitrajes en tiempo real y trading.",
    features: [
      "Escaneo en 100+ plataformas (incluye Exchanges)",
      "Arbitrajes Pre-partido y Live",
      "Arbitrajes con beneficio > 0%",
      "API de Integración (Beta)",
      "Asesor Personalizado",
    ],
    isPopular: false,
  },
];

// Componente que simula la lista de arbitrajes (Diseño mejorado)
const ArbitrageListMockup = () => {
    // Datos de arbitraje más atractivos
    const arbitrageData = [
        { percentage: 2.85, team1: "Lakers", team2: "Celtics", odds1: 1.88, odds2: 2.30, bookmaker1: "Betfair", bookmaker2: "Pinnacle" },
        { percentage: 1.90, team1: "Real Madrid", team2: "Barcelona", odds1: 2.05, odds2: 2.15, bookmaker1: "Bet365", bookmaker2: "Smarkets" },
        { percentage: 3.12, team1: "Man. City", team2: "Liverpool", odds1: 1.75, odds2: 2.45, bookmaker1: "William Hill", bookmaker2: "Betfair Exchange" },
    ];

    return (
        <div className="w-full h-full p-4 md:p-6 bg-[var(--color-card-bg)] rounded-xl shadow-inner border border-[var(--color-border)]">
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-accent)] flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-[var(--color-green-text)]" />
                Oportunidades de Arbitraje
            </h3>
            
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-background-tertiary)] flex justify-between items-center text-sm">
                <span className="text-[var(--color-text-secondary)]">Capital (Bank):</span>
                <span className="font-bold text-[var(--color-text-accent)] flex items-center">
                    10,000 € 
                    <CreditCard className="w-4 h-4 ml-2 text-[var(--color-accent-primary)]" />
                </span>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {arbitrageData.map((arb, index) => (
                    <div key={index} className="p-4 rounded-xl bg-[var(--color-subtle-bg)] border border-[var(--color-border)] shadow-md hover:shadow-lg transition-shadow duration-200">
                        {/* Porcentaje de Ganancia - Más llamativo */}
                        <div className={`text-sm font-bold inline-block px-3 py-1 rounded-full mb-3 
                                        bg-[var(--color-green-text)] text-white shadow-lg`}>
                            +{arb.percentage.toFixed(2)}%
                        </div>
                        
                        {/* Título del Evento */}
                        <p className="text-md font-medium text-[var(--color-text-accent)] mb-3">
                            {arb.team1} vs {arb.team2}
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Apuesta 1 (Back) */}
                            <div className="p-3 rounded-lg bg-[var(--color-background-primary)] border border-green-500/30">
                                <span className="text-xs font-semibold uppercase text-[var(--color-text-secondary)] block mb-1">BACK ({arb.bookmaker1})</span>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-extrabold text-[var(--color-green-text)]">{arb.odds1.toFixed(2)}</span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">Stake: €{((10000 * 100 / arb.percentage) / arb.odds1).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Apuesta 2 (Lay) - Usamos Lay si la segunda es una casa de intercambio */}
                            <div className="p-3 rounded-lg bg-[var(--color-background-primary)] border border-red-500/30">
                                <span className="text-xs font-semibold uppercase text-[var(--color-text-secondary)] block mb-1">LAY ({arb.bookmaker2})</span>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-extrabold text-[var(--color-red-text)]">{arb.odds2.toFixed(2)}</span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">Stake: €{((10000 * 100 / arb.percentage) / arb.odds2).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="mt-4 text-xs text-right text-[var(--color-text-secondary)]">
                <Clock className="w-3 h-3 inline mr-1" />
                Actualizado hace 0.1s
            </p>
        </div>
    );
}

/**
 * Modal de Inicio de Sesión y Registro con conexión al backend Flask (JWT).
 * @param {function} onClose - Función para cerrar el modal.
 * @param {function} onAuthSuccess - Función para manejar el éxito de la autenticación.
 */
const LoginModal = ({ onClose, onAuthSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Lógica de Comunicación con el Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Por favor, introduce email y contraseña.');
            setLoading(false);
            return;
        }

        const endpoint = isRegistering ? `${AUTH_URL}/register` : `${AUTH_URL}/login`;

        try {
            // Petición HTTP POST al servicio de autenticación de Flask
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Autenticación exitosa: guardar token JWT
                localStorage.setItem('userToken', data.token);
                
                // Notificar al componente padre que el usuario ha iniciado sesión
                onAuthSuccess(email, data.token); 
            } else {
                // Manejar errores del backend
                setError(data.message || `Error ${response.status}: Intenta con demo@arbitrage.com / password.`);
            }
        } catch (err) {
            // Manejar errores de red/conexión (si el backend no está corriendo)
            console.error("Error de conexión:", err);
            setError('Error de conexión con el servidor. Asegúrate de que el backend Flask esté corriendo en el puerto 5001.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-md p-8 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-2xl relative transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors"
                    aria-label="Cerrar modal"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-3xl font-bold mb-2 text-[var(--color-text-accent)] text-center">
                    {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-6 text-center">
                    Accede a tus oportunidades de arbitraje.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Campo Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border text-[var(--color-text-accent)] bg-[var(--color-background-secondary)] border-[var(--color-input-border)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all"
                            disabled={loading}
                        />
                    </div>
                    
                    {/* Campo Contraseña */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border text-[var(--color-text-accent)] bg-[var(--color-background-secondary)] border-[var(--color-input-border)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all"
                            disabled={loading}
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <p className="text-sm text-center text-[var(--color-red-text)] font-medium p-2 rounded-lg bg-[var(--color-red-text)] bg-opacity-10 border border-red-800">
                            {error}
                        </p>
                    )}

                    {/* Botón de Autenticación */}
                    <button
                        type="submit"
                        className={`w-full py-3 mt-4 text-lg font-bold rounded-lg transition-colors flex items-center justify-center 
                                   ${loading ? 'bg-[var(--color-accent-primary)] opacity-70 cursor-not-allowed' : 'bg-[var(--color-accent-primary)] hover:bg-[#0ea5e9]'} 
                                   text-white shadow-lg`}
                        disabled={loading}
                    >
                        {loading && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Alternar entre Login y Registro */}
                <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
                    {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                    <button
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                        className="font-semibold text-[var(--color-accent-primary)] hover:underline ml-1 transition-colors"
                    >
                        {isRegistering ? 'Iniciar Sesión' : 'Regístrate'}
                    </button>
                </div>

            </div>
        </div>
    );
};

// Componente principal de la Landing Page
export default function LandingPage({ onStartClick }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' o 'yearly'
  // Simulación de autenticación
  const [user, setUser] = useState(null); 
  // ✅ NUEVO: Estado para controlar la visibilidad del modal de login
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const { theme, toggleTheme } = useTheme();

  // ✅ ACTUALIZADO: Manejadores para el modal y la autenticación
  const handleLoginClick = () => setShowLoginModal(true);
  const handleLogout = () => setUser(null);
  const handleCloseModal = () => setShowLoginModal(false);
  
  const handleAuthSuccess = (username) => {
    // Simula la autenticación exitosa
    setUser({ name: username });
    setShowLoginModal(false);
  };

  const getPrice = (priceStr) => {
    const price = parseInt(priceStr.replace('€', ''), 10);
    // Aplicar descuento anual simulado del 20% solo a planes de pago
    if (price === 0) return priceStr;
    return billingCycle === 'yearly' ? `€${Math.round(price * 0.8) * 12}` : priceStr;
  };

  const CTA_BUTTON = "Comenzar Gratis";

  return (
    <div className="min-h-screen">
      {/* 1. Header con Login y Selector de Tema */}
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onLogin={handleLoginClick} // Usar el nuevo manejador para abrir el modal
        onLogout={handleLogout} 
        user={user} 
      />

      {/* ---------------------------------- */}
      {/* 2. SECCIÓN HERO (Primer pantallazo) */}
      {/* ---------------------------------- */}
      <section className="pt-28 pb-20 md:pt-40 md:pb-32 text-center overflow-hidden bg-[var(--color-background-primary)]">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-[var(--color-text-accent)]">
            Convierte el riesgo en beneficio con <span className="text-[var(--color-accent-primary)]">ArbitrageFlow</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-[var(--color-text-secondary)]">
            El escáner de arbitraje más rápido para apuestas deportivas. Encuentra apuestas seguras y garantiza ganancias sin riesgo, pase lo que pase.
          </p>
          
          <button
            onClick={onStartClick}
            // ✅ CORRECCIÓN: Se ha cambiado el color de fondo a un color sólido y llamativo
            className="inline-flex items-center justify-center px-10 py-3.5 text-lg font-bold rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.03] 
                       bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)] focus:ring-opacity-50"
          >
            <Rocket className="w-5 h-5 mr-2" />
            {CTA_BUTTON}
          </button>
          
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            No se requiere tarjeta de crédito. Prueba gratuita de 7 días.
          </p>
          
          {/* Ilustración de Dashboard (Mockup mejorado) */}
          <div className="mt-20 relative transform perspective-[1000px] rotateX-[1deg] md:rotateX-[2deg]">
             <div className="max-w-4xl mx-auto">
                <ArbitrageListMockup />
             </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------- */}
      {/* 3. SECCIÓN DE CARACTERÍSTICAS */}
      {/* ---------------------------------- */}
      <section id="features" className="py-20 md:py-32 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
            Características que Garantizan el Éxito
          </h2>
          <p className="text-center text-lg mb-16 text-[var(--color-text-secondary)] max-w-4xl mx-auto">
            Nuestro motor de escaneo está diseñado por traders profesionales para asegurar la máxima rentabilidad y minimizar la latencia.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-5px]"
                >
                  <Icon className="w-10 h-10 mb-4 text-[var(--color-accent-primary)]" />
                  <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-accent)]">{feature.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------- */}
      {/* 4. SECCIÓN DE PRECIOS */}
      {/* ---------------------------------- */}
      <section id="pricing" className="py-20 md:py-32 bg-[var(--color-background-primary)] border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[var(--color-text-accent)]">
            Planes de Suscripción Flexibles
          </h2>
          <p className="text-center text-lg mb-12 text-[var(--color-text-secondary)] max-w-4xl mx-auto">
            Elige el plan que mejor se adapte a tu volumen de trading y accede a las mejores oportunidades del mercado.
          </p>

          {/* Toggle de Facturación */}
          <div className="flex justify-center mb-12">
            <div className="flex p-1 rounded-full bg-[var(--color-background-secondary)] border border-[var(--color-border)]">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
                  billingCycle === 'monthly' ? 'bg-[var(--color-accent-primary)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)]'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors relative ${
                  billingCycle === 'yearly' ? 'bg-[var(--color-accent-primary)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)]'
                }`}
              >
                Anual
                <span className="absolute -top-2 right-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold transform rotate-6">
                  -20%
                </span>
              </button>
            </div>
          </div>
          
          {/* Tarjetas de Precios */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8"> {/* ✅ MODIFICACIÓN: Se cambió a grid-cols-4 para acomodar el nuevo plan */}
            {PRICING_PLANS.map((plan, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border transition-all duration-300 transform ${
                  plan.isPopular 
                    ? 'border-[var(--color-accent-primary)] bg-[var(--color-card-bg)] shadow-2xl scale-[1.05] lg:scale-[1.02]' 
                    : 'border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md hover:shadow-xl'
                }`}
              >
                {plan.isPopular && (
                  <div className="text-sm font-bold text-center text-white bg-[var(--color-accent-primary)] rounded-full py-1 px-4 mb-4 inline-block">
                    Más Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-1 text-[var(--color-text-accent)]">{plan.name}</h3>
                <p className="text-[var(--color-text-secondary)] mb-4">{plan.tagline}</p>

                <div className="text-4xl font-extrabold text-[var(--color-text-accent)] mb-1">
                  {getPrice(plan.price)}
                  <span className="text-lg font-normal text-[var(--color-text-secondary)]">
                    {plan.isFree ? '' : (billingCycle === 'monthly' ? '/mes' : '/año')}
                  </span>
                </div>
                
                <p className="text-sm text-[var(--color-text-secondary)] mb-8 h-4">
                  {/* Se ajusta el cálculo de ahorro para el precio anual corregido */}
                  {billingCycle === 'yearly' && !plan.isFree ? `Ahorra hasta €${parseInt(plan.price.replace('€', ''), 10) * 12 - Math.round(parseInt(plan.price.replace('€', ''), 10) * 0.8) * 12} al año` : ''}
                </p>

                <button
                  onClick={onStartClick}
                  className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                    plan.isPopular
                      ? 'bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9] shadow-lg'
                      : plan.isFree
                        ? 'bg-[var(--color-green-text)] text-white hover:bg-green-600 shadow-lg'
                        : 'bg-[var(--color-background-tertiary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)]'
                  }`}
                >
                  {plan.isFree ? 'Empezar Gratis' : (plan.isPopular ? 'Comenzar con Pro' : 'Seleccionar Plan')}
                </button>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-[var(--color-text-primary)]">
                      <Check className="w-5 h-5 mr-2 text-[var(--color-green-text)] flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------- */}
      {/* 5. FOOTER (Simple) */}
      {/* ---------------------------------- */}
      <footer className="py-8 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)]">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[var(--color-text-secondary)]">
          &copy; {new Date().getFullYear()} ArbitrageFlow. Todos los derechos reservados.
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Términos</a>
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
      
      {/* 6. Modal de Inicio de Sesión / Registro */}
      {showLoginModal && (
          <LoginModal 
              onClose={handleCloseModal} 
              onAuthSuccess={handleAuthSuccess} 
          />
      )}
    </div>
  );
}