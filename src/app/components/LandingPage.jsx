import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Shield, DollarSign, CreditCard, Rocket, Users, Check, Star, Clock, Maximize, LogIn, Sun, Moon, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient'; // Ajusta la ruta
import LoginModal from './LoginModal'; // <-- IMPORTANTE: Importar el modal

// --------------------
// Hook de Tema (sin cambios)
// --------------------
const useTheme = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
        document.documentElement.style.setProperty('--color-background-primary', savedTheme === 'dark' ? '#0d111c' : '#ffffff');
        document.documentElement.style.setProperty('--color-background-secondary', savedTheme === 'dark' ? '#161b22' : '#f0f4f8');
        document.documentElement.style.setProperty('--color-background-tertiary', savedTheme === 'dark' ? '#21262d' : '#e0e4e8');
        document.documentElement.style.setProperty('--color-text-primary', savedTheme === 'dark' ? '#f0f6fc' : '#1c2128');
        document.documentElement.style.setProperty('--color-text-secondary', savedTheme === 'dark' ? '#8b949e' : '#57606a');
        document.documentElement.style.setProperty('--color-text-accent', savedTheme === 'dark' ? '#c9d1d9' : '#1c2128');
        document.documentElement.style.setProperty('--color-accent-primary', '#1e90ff');
        document.documentElement.style.setProperty('--color-green-text', '#3fb950');
        document.documentElement.style.setProperty('--color-red-text', '#f85149');
        document.documentElement.style.setProperty('--color-card-bg', savedTheme === 'dark' ? '#1f242b' : '#ffffff');
        document.documentElement.style.setProperty('--color-border', savedTheme === 'dark' ? '#30363d' : '#d0d7de');
        document.documentElement.style.setProperty('--color-subtle-bg', savedTheme === 'dark' ? '#2d333b' : '#f6f8fa');
        document.documentElement.style.setProperty('--color-hover-bg', savedTheme === 'dark' ? '#3e444b' : '#e8ebed');
        document.documentElement.style.setProperty('--color-input-border', savedTheme === 'dark' ? '#444c56' : '#c9d1d9');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return { theme, toggleTheme };
};

// --------------------
// Header (MODIFICADO)
// --------------------
const Header = ({ theme, toggleTheme, onLogin, onLogout, user }) => {
    const ThemeIcon = theme === 'dark' ? Sun : Moon;
    
    // Función de redirección simple (para el botón de arbitraje)
    const navigateToArbitrage = () => {
        window.location.assign('/arbitrages');
    };

    return (
        <header className="fixed top-0 left-0 w-full z-10 bg-[var(--color-background-primary)] shadow-md border-b border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <span className="text-2xl font-bold text-[var(--color-accent-primary)] cursor-pointer"> ArbitrageFlow </span>
                <nav className="flex items-center space-x-4">
                    <a href="#features" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors text-sm font-medium hidden md:block">Características</a>
                    <a href="#pricing" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors text-sm font-medium hidden md:block">Precios</a>
                    
                    {/* Botones Condicionales */}
                    {user ? (
                        // Opción 1: Usuario LOGUEADO
                        <div className="flex items-center space-x-3">
                            {/* Botón Principal: IR AL ARBITRAJE (Verde) */}
                            <button 
                                onClick={navigateToArbitrage} 
                                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] 
                                           bg-[var(--color-green-text)] text-white shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                            >
                                <TrendingUp className="w-5 h-5 mr-2" />
                                <span>Ir a /Arbitraje</span>
                            </button>
                            
                            {/* Botón Secundario: CERRAR SESIÓN (Rojo explícito) */}
                            <button 
                                onClick={onLogout} 
                                className="inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors 
                                           bg-red-600 text-white hover:bg-red-700 shadow-md"
                                title="Cerrar Sesión"
                            >
                                <LogOut className="w-4 h-4 mr-1.5" />
                                <span>Salir</span>
                            </button>
                        </div>
                    ) : (
                        // Opción 2: Usuario NO LOGUEADO
                        <button 
                            onClick={onLogin} 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors 
                                       bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9] shadow-md hover:shadow-lg" 
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            <span>Iniciar Sesión</span>
                        </button>
                    )}

                    <button onClick={toggleTheme} className="p-2 rounded-full bg-[var(--color-background-tertiary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)] transition-colors" aria-label="Toggle theme" >
                        <ThemeIcon className="w-5 h-5" />
                    </button>
                </nav>
            </div>
        </header>
    );
};

// ... el resto del componente LandingPage permanece inalterado.

// --- Componentes de Datos y Lógica (Sin cambios) ---
// Constantes de datos (Mock data para la demo)
const FEATURES = [
    { title: "Arbitraje en Tiempo Real", description: "Escaneo ultrarrápido a través de más de 80 casas de apuestas y exchanges para no perderte ni una oportunidad.", icon: Zap },
    { title: "Seguimiento de Beneficios", description: "Visualiza tus ganancias y pérdidas históricas, rendimiento por deporte y análisis detallado de ROI.", icon: TrendingUp },
    { title: "Seguridad y Transparencia", description: "Cálculos verificados y encriptación de datos para garantizar la seguridad de tu información financiera.", icon: Shield },
    { title: "Calculadora Integrada", description: "Ajusta automáticamente las apuestas 'back' y 'lay' basándose en tu bankroll disponible.", icon: Maximize },
];

const PRICING_PLANS = [
    { name: "Free", price: "€0", tagline: "Acceso permanente a la plataforma con arbitrajes básicos.", features: [ "Escaneo en 5 casas de apuestas", "Arbitrajes con beneficio > 3.0%", "Retraso de datos de 30 minutos", "Soporte por documentación", ], isPopular: false, isFree: true, },
    { name: "Starter", price: "€29", tagline: "Ideal para principiantes que empiezan a explorar el arbitraje.", features: [ "Escaneo en 20+ casas de apuestas", "Arbitrajes con beneficio > 1.5%", "Notificaciones por email", "Soporte Estándar", ], isPopular: false, },
    { name: "Pro", price: "€99", tagline: "Herramientas avanzadas para arbitrajistas a tiempo parcial.", features: [ "Escaneo en 80+ casas de apuestas", "Arbitrajes con beneficio > 0%", "Notificaciones instantáneas (SMS/Telegram)", "Calculadora de Arbitraje avanzada", "Soporte Premium 24/7", ], isPopular: true, },
    { name: "Ultimate", price: "€199", tagline: "Máxima velocidad y acceso a arbitrajes en tiempo real y trading.", features: [ "Escaneo en 100+ plataformas (incluye Exchanges)", "Arbitrajes Pre-partido y Live", "Arbitrajes con beneficio > 0%", "API de Integración (Beta)", "Asesor Personalizado", ], isPopular: false, },
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
                <DollarSign className="w-5 h-5 mr-2 text-[var(--color-green-text)]" /> Oportunidades de Arbitraje
            </h3>
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-background-tertiary)] flex justify-between items-center text-sm">
                <span className="text-[var(--color-text-secondary)]">Capital (Bank):</span>
                <span className="font-bold text-[var(--color-text-accent)] flex items-center"> 10,000 € <CreditCard className="w-4 h-4 ml-2 text-[var(--color-accent-primary)]" /> </span>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {arbitrageData.map((arb, index) => (
                    <div key={index} className="p-4 rounded-xl bg-[var(--color-subtle-bg)] border border-[var(--color-border)] shadow-md hover:shadow-lg transition-shadow duration-200">
                        {/* Porcentaje de Ganancia - Más llamativo */}
                        <div className={`text-sm font-bold inline-block px-3 py-1 rounded-full mb-3 bg-[var(--color-green-text)] text-white shadow-lg`}>
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
                <Clock className="w-3 h-3 inline mr-1" /> Actualizado hace 0.1s
            </p>
        </div>
    );
}

// Componente principal de la Landing Page
export default function LandingPage({ onStartClick }) {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' o 'yearly'
    // Simulación de autenticación
    const [user, setUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // Revisamos si ya hay cookie con token
        const match = document.cookie.match(/sb-access-token=([^;]+)/);
        if (match) {
            setUser({ name: 'Usuario', token: match[1] });
        }
    }, []);

    // ACTUALIZADO: Manejadores para el modal y la autenticación
    const handleLogin = () => setShowLoginModal(true);
    const handleLogout = () => {
        setUser(null);
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    };
    const handleCloseModal = () => setShowLoginModal(false);
    const handleAuthSuccess = (session) => {
        // Usamos el email del usuario si está disponible, si no, un valor por defecto
        const email = session?.user?.email || 'Usuario';
        setUser({ name: email, token: session.access_token });
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
            <Header theme={theme} toggleTheme={toggleTheme} onLogin={handleLogin} onLogout={handleLogout} user={user} />

            {/* ---------------------------------- */}
            {/* 2. SECCIÓN HERO (Primer pantallazo) */}
            {/* ---------------------------------- */}
            <section className="pt-28 pb-20 md:pt-40 md:pb-32 text-center overflow-hidden bg-[var(--color-background-primary)]">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-[var(--color-text-accent)]"> Convierte el riesgo en beneficio con <span className="text-[var(--color-accent-primary)]">SureVisionOne</span> </h1>
                    <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-[var(--color-text-secondary)]"> El escáner de arbitraje más rápido para apuestas deportivas. Encuentra apuestas seguras y garantiza ganancias sin riesgo, pase lo que pase. </p>
                    <button onClick={onStartClick}
                        className="inline-flex items-center justify-center px-10 py-3.5 text-lg font-bold rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.03] bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)] focus:ring-opacity-50"
                    >
                        <Rocket className="w-5 h-5 mr-2" /> {CTA_BUTTON}
                    </button>
                    <p className="mt-3 text-sm text-[var(--color-text-secondary)]"> No se requiere tarjeta de crédito. Prueba gratuita de 7 días. </p>

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
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[var(--color-text-accent)]"> Características que Garantizan el Éxito </h2>
                    <p className="text-center text-lg mb-16 text-[var(--color-text-secondary)] max-w-4xl mx-auto"> Nuestro motor de escaneo está diseñado por traders profesionales para asegurar la máxima rentabilidad y minimizar la latencia. </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="p-6 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-5px]"
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
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[var(--color-text-accent)]"> Planes de Suscripción Flexibles </h2>
                    <p className="text-center text-lg mb-12 text-[var(--color-text-secondary)] max-w-4xl mx-auto"> Elige el plan que mejor se adapte a tu volumen de trading y accede a las mejores oportunidades del mercado. </p>

                    {/* Toggle de Facturación */}
                    <div className="flex justify-center mb-12">
                        <div className="flex p-1 rounded-full bg-[var(--color-background-secondary)] border border-[var(--color-border)]">
                            <button onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${ billingCycle === 'monthly' ? 'bg-[var(--color-accent-primary)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)]'}`}
                            >
                                Mensual
                            </button>
                            <button onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors relative ${ billingCycle === 'yearly' ? 'bg-[var(--color-accent-primary)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)]'}`}
                            >
                                Anual
                                <span className="absolute -top-2 right-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold transform rotate-6"> -20% </span>
                            </button>
                        </div>
                    </div>

                    {/* Tarjetas de Precios */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {PRICING_PLANS.map((plan, index) => (
                            <div key={index} className={`p-8 rounded-2xl border transition-all duration-300 transform ${ plan.isPopular ? 'border-[var(--color-accent-primary)] bg-[var(--color-card-bg)] shadow-2xl scale-[1.05] lg:scale-[1.02]' : 'border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md hover:shadow-xl'}`}
                            >
                                {plan.isPopular && (
                                    <div className="text-sm font-bold text-center text-white bg-[var(--color-accent-primary)] rounded-full py-1 px-4 mb-4 inline-block"> Más Popular </div>
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
                                <button onClick={onStartClick}
                                    className={`w-full py-3 font-semibold rounded-lg transition-colors ${ plan.isPopular ? 'bg-[var(--color-accent-primary)] text-white hover:bg-[#0ea5e9] shadow-lg' : plan.isFree ? 'bg-[var(--color-green-text)] text-white hover:bg-green-600 shadow-lg' : 'bg-[var(--color-background-tertiary)] text-[var(--color-text-accent)] hover:bg-[var(--color-hover-bg)]'}`}
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
                    &copy; {new Date().getFullYear()} SureVisionOne. Todos los derechos reservados.
                    <div className="mt-2 space-x-4">
                        <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Términos</a>
                        <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Contacto</a>
                    </div>
                </div>
            </footer>

            {/* 6. Modal de Inicio de Sesión / Registro */}
            {showLoginModal && (
                <LoginModal onClose={handleCloseModal} onAuthSuccess={handleAuthSuccess} />
            )}
        </div>
    );
}