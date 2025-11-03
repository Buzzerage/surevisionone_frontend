import type { LanguageCode } from "./language";

type LandingFeature = {
  title: string;
  description: string;
};

type PricingPlan = {
  name: string;
  price: {
    eur: number;
    gbp: number;
  };
  tagline: string;
  features: string[];
  isPopular?: boolean;
  isFree?: boolean;
  cta: string;
};

type PanelCopy = {
  loading: string;
  verify: {
    heading: string;
    descriptionBeforeEmail: string;
    descriptionAfterEmail: string;
    infoSpam: string;
    infoConfirm: string;
    buttonIdle: string;
    buttonLoading: string;
    messageUnverified: string;
    messageVerified: string;
    messageGenericError: string;
  };
};

type ProfileCopy = {
  back: string;
  headerBadge: string;
  headerTitle: string;
  headerDescription: string;
  mainCard: {
    title: string;
    description: string;
    fullName: string;
    email: string;
    language: string;
    activePlan: string;
    planStatus: string;
    renewal: string;
  };
  securityCard: {
    title: string;
    description: string;
  };
  passwordForm: {
    current: string;
    next: string;
    confirm: string;
    submit: string;
    submitting: string;
  };
  planCard: {
    titlePrefix: string;
    titleSuffix: string;
    opportunities: string;
    alerts: string;
    refresh: string;
    refreshEvery: string;
    refreshUnit: string;
  };
  dangerCard: {
    title: string;
    description: string;
    body: string;
    delete: string;
    processing: string;
  };
  alertDismiss: string;
  feedback: {
    passwordMissingFields: string;
    passwordMismatch: string;
    passwordRequirements: string;
    passwordMissingEmail: string;
    passwordIncorrectCurrent: string;
    passwordValidateFailed: string;
    passwordInvalidNew: string;
    passwordUpdateFailed: string;
    passwordUpdated: string;
    upgradeInfo: string;
    deleteConfirm: string;
    deleteSessionCheck: string;
    deleteTokenMissing: string;
    deleteFailed: string;
    deleteSuccess: string;
  };
  planLibrary: Record<string, {
    description: string;
    features: string[];
    cta: string;
  }>;
};

type ArbitrageCopy = {
  currency: {
    locale: string;
    currency: string;
    symbol: string;
  };
  mobile: {
    filters: string;
    bank: string;
  };
  defaults: {
    bookmakerAll: string;
    betTypesAll: string;
  };
  sortOptions: {
    profitDesc: string;
    profitAsc: string;
    matchAz: string;
    matchZa: string;
  };
  filtersToolbar: {
    ariaLabel: string;
    refineResults: string;
    close: string;
    reset: string;
    sportLabel: string;
    sportAria: string;
    searchLabel: string;
    searchPlaceholder: string;
    bookmakerLabel: string;
    minProfitLabel: string;
    minProfitPlaceholder: string;
    adjustMinProfit: string;
    incrementMinProfit: string;
    decrementMinProfit: string;
    betTypeLabel: string;
    sortLabel: string;
  };
  bankSidebar: {
    ariaLabel: string;
    title: string;
    description: string;
    close: string;
    capitalLabel: string;
    shortcutsAria: string;
  };
  list: {
    heading: string;
    sportSuffix: string;
    loadingLive: string;
    noResultsFiltered: string;
    noResults: string;
    loadingOverlay: string;
  };
  card: {
    ariaLabel: string;
    newBadge: string;
    betInfo: {
      stake: string;
      liability: string;
      back: string;
      lay: string;
    };
    homePrefix: string;
    awayPrefix: string;
  };
  sportToggle: {
    title: string;
    open: string;
    close: string;
  };
  sports: Record<string, string>;
};

type AuthCopy = {
  titles: {
    login: string;
    register: string;
    forgot: string;
  };
  placeholders: {
    email: string;
    password: string;
  };
  regionLabel: string;
  regionOptions: {
    EU: string;
    UK: string;
  };
  forgotInstructions: string;
  success: {
    reset: string;
    register: string;
    login: string;
  };
  buttons: {
    sendReset: string;
    register: string;
    login: string;
    continue: string;
    dismiss: string;
  };
  links: {
    haveAccount: string;
    needAccount: string;
    forgotPassword: string;
    backToLogin: string;
  };
  errors: {
    regionRequired: string;
    genericSignIn: string;
  };
};

type LandingCopy = {
  hero: {
    titlePrefix: string;
    highlight: string;
    subtitle: string;
    cta: string;
  };
  featuresTitle: string;
  arbitrageTitle: string;
  pricingTitle: string;
  footer: string;
  features: LandingFeature[];
  pricingPlans: PricingPlan[];
};

type HeaderCopy = {
  public: {
    goToAccount: string;
    goToPanel: string;
  };
  private: {
    defaultUser: string;
    settings: string;
    signOut: string;
  };
};

type AppTranslations = {
  languageNames: Record<LanguageCode, string>;
  header: HeaderCopy;
  auth: AuthCopy;
  landing: LandingCopy;
  panel: PanelCopy;
  profile: ProfileCopy;
  arbitrage: ArbitrageCopy;
};

export const translations: Record<LanguageCode, AppTranslations> = {
  en: {
    languageNames: {
      en: "English",
      es: "Spanish",
    },
    header: {
      public: {
        goToAccount: "Go to your account",
        goToPanel: "Go to dashboard",
      },
      private: {
        defaultUser: "User",
        settings: "Settings",
        signOut: "Log out",
      },
    },
    auth: {
      titles: {
        login: "Sign in",
        register: "Create account",
        forgot: "Recover password",
      },
      placeholders: {
        email: "Email address",
        password: "Password",
      },
      regionLabel: "Choose your betting region",
      regionOptions: {
        EU: "Europe (EU)",
        UK: "United Kingdom (UK)",
      },
      forgotInstructions: "Enter your email and we'll send you a secure reset link.",
      success: {
        reset: "We've sent you a secure link to reset your password. Check your inbox.",
        register:
          "Account created. Check your email and verify your account to access the dashboard securely.",
        login: "Logged in successfully. Redirecting to the dashboard...",
      },
      buttons: {
        sendReset: "Send reset link",
        register: "Create account",
        login: "Sign in",
        continue: "Continue",
        dismiss: "Okay, I'll check my inbox",
      },
      links: {
        haveAccount: "Already have an account? Sign in",
        needAccount: "Don't have an account yet? Register",
        forgotPassword: "Forgot your password?",
        backToLogin: "Back to sign in",
      },
      errors: {
        regionRequired: "Select your betting region to continue.",
        genericSignIn: "Unable to start the session.",
      },
    },
    landing: {
      hero: {
        titlePrefix: "Turn risk into profit with ",
        highlight: "SureVisionOne",
        subtitle:
          "The fastest sports arbitrage scanner. Find sure bets and secure risk-free returns.",
        cta: "Start for free",
      },
      featuresTitle: "Features built for winning arbitrage",
      arbitrageTitle: "Arbitrage opportunities",
      pricingTitle: "Flexible subscription plans",
      footer: "All rights reserved.",
      features: [
        {
          title: "Real-time arbitrage",
          description:
            "Lightning-fast scanning across more than 80 bookmakers and exchanges so you never miss a sure bet.",
        },
        {
          title: "Profit tracking",
          description:
            "Visualise historic profit & loss, analyse performance by sport, and monitor a detailed ROI breakdown.",
        },
        {
          title: "Security and transparency",
          description:
            "Verified calculations and encrypted storage keep your financial and personal information protected.",
        },
        {
          title: "Integrated calculator",
          description:
            "Automatically adjusts back and lay stakes using your bankroll so every trade is perfectly balanced.",
        },
      ],
      pricingPlans: [
        {
          name: "Free",
          price: { eur: 0, gbp: 0 },
          tagline: "Permanent access to the platform with essential arbitrage alerts.",
          features: [
            "Scanning across 5 bookmakers",
            "Opportunities with profit > 3.0%",
            "30 minute data delay",
            "Documentation-only support",
          ],
          isFree: true,
          cta: "Start for free",
        },
        {
          name: "Starter",
          price: { eur: 29, gbp: 25 },
          tagline: "Ideal for newcomers exploring arbitrage and building a routine.",
          features: [
            "Scanning in 20+ bookmakers",
            "Opportunities with profit > 1.5%",
            "Email notifications",
            "Standard support",
          ],
          cta: "Choose Starter",
        },
        {
          name: "Pro",
          price: { eur: 99, gbp: 85 },
          tagline: "Advanced tooling for part-time traders that need instant signals.",
          features: [
            "Scanning in 80+ bookmakers",
            "Opportunities with profit > 0%",
            "Instant SMS/Telegram alerts",
            "Advanced arbitrage calculator",
            "24/7 premium support",
          ],
          isPopular: true,
          cta: "Get the Pro plan",
        },
        {
          name: "Ultimate",
          price: { eur: 199, gbp: 169 },
          tagline: "Maximum speed with real-time access and trading workflows.",
          features: [
            "Scanning in 100+ platforms (including exchanges)",
            "Pre-match and live arbitrage coverage",
            "Opportunities with profit > 0%",
            "Integration API (Beta)",
            "Personal advisor",
          ],
          cta: "Contact sales",
        },
      ],
    },
    panel: {
      loading: "Loading secure session...",
      verify: {
        heading: "Verify your email to activate secure access",
        descriptionBeforeEmail: "We've sent a confirmation message to ",
        descriptionAfterEmail:
          ". Once you validate your account, you can access the dashboard with all security measures enabled.",
        infoSpam:
          "If you can't find the email, check your spam or promotions folder and mark the message as safe.",
        infoConfirm:
          "After confirming, return here and press the button below to verify your account status.",
        buttonIdle: "I've verified my email",
        buttonLoading: "Checking verification...",
        messageUnverified:
          "Your account is not verified yet. Check your inbox or try again shortly.",
        messageVerified: "Verification confirmed. Redirecting to the secure dashboard...",
        messageGenericError: "We couldn't check the account status. Try again later.",
      },
    },
    profile: {
      back: "Back",
      headerBadge: "User panel",
      headerTitle: "Your profile",
      headerDescription:
        "Manage the information linked to your account, adjust security settings, and review your subscription status.",
      mainCard: {
        title: "Primary information",
        description: "This data is private and only you can see it.",
        fullName: "Full name",
        email: "Email address",
        language: "Preferred language",
        activePlan: "Active plan",
        planStatus: "Plan status",
        renewal: "Next renewal",
      },
      securityCard: {
        title: "Security",
        description: "Updating your password keeps the account protected.",
      },
      passwordForm: {
        current: "Current password",
        next: "New password",
        confirm: "Confirm new password",
        submit: "Update password",
        submitting: "Updating...",
      },
      planCard: {
        titlePrefix: "Your",
        titleSuffix: "plan",
        opportunities: "Opportunities per day",
        alerts: "Available alerts",
        refresh: "Data refresh",
        refreshEvery: "Every",
        refreshUnit: "min",
      },
      dangerCard: {
        title: "Danger zone",
        description: "Deleting the account is irreversible.",
        body:
          "This action will remove your account and payment method, and you won't be able to restore them afterwards.",
        delete: "Delete account",
        processing: "Processing...",
      },
      alertDismiss: "Close",
      feedback: {
        passwordMissingFields: "Complete all fields to update your password.",
        passwordMismatch: "The new passwords do not match.",
        passwordRequirements:
          "The password must be at least 12 characters long and include a lowercase letter, an uppercase letter, and a number.",
        passwordMissingEmail:
          "We couldn't find your email address to validate the current password.",
        passwordIncorrectCurrent: "The current password is not correct.",
        passwordValidateFailed: "We couldn't validate your current password.",
        passwordInvalidNew: "The new password does not meet the security requirements.",
        passwordUpdateFailed: "We couldn't update the password.",
        passwordUpdated: "Your password was updated successfully.",
        upgradeInfo:
          "We'll show the available plans on the homepage so you can review an upgrade.",
        deleteConfirm:
          "This action will delete your account and associated data. Do you want to continue?",
        deleteSessionCheck: "We couldn't verify the current session.",
        deleteTokenMissing: "We couldn't validate your session to delete the account.",
        deleteFailed: "We couldn't delete the account.",
        deleteSuccess:
          "Your account was deleted successfully. We'll redirect you to the homepage.",
      },
      planLibrary: {
        Free: {
          description:
            "Free plan to explore the essential features before moving to a paid subscription.",
          features: [
            "Basic arbitrage alerts every 30 minutes",
            "Track a handful of favourite opportunities",
            "Documentation and community access",
          ],
          cta: "Discover plans with more automation",
        },
        Starter: {
          description:
            "Built for traders operating a few times per week who need additional context.",
          features: [
            "Coverage across more bookmakers",
            "Email alerts for highlighted opportunities",
            "Exportable history in CSV",
          ],
          cta: "Upgrade to the Pro plan for extra speed",
        },
        Pro: {
          description:
            "Includes advanced metrics and near real-time synchronisation for daily traders.",
          features: [
            "Updates every few minutes",
            "Push and Telegram notifications",
            "Analytics dashboard with sport comparisons",
          ],
          cta: "Request Ultimate access for deeper automation",
        },
        Ultimate: {
          description:
            "Complete suite with API access and personalised 24/7 support for professional teams.",
          features: [
            "Unrestricted live arbitrage",
            "Automated workflows with higher limits",
            "Dedicated account manager",
          ],
          cta: "Contact us to scale your operation",
        },
      },
    },
    arbitrage: {
      currency: {
        locale: "en-GB",
        currency: "GBP",
        symbol: "£",
      },
      mobile: {
        filters: "Filters",
        bank: "Bank",
      },
      defaults: {
        bookmakerAll: "All bookmakers",
        betTypesAll: "All arbitrage types",
      },
      sortOptions: {
        profitDesc: "Profit (high to low)",
        profitAsc: "Profit (low to high)",
        matchAz: "Match (A-Z)",
        matchZa: "Match (Z-A)",
      },
      filtersToolbar: {
        ariaLabel: "Advanced filters",
        refineResults: "Refine results",
        close: "Close filters",
        reset: "Reset filters",
        sportLabel: "Sport",
        sportAria: "Filter by sport",
        searchLabel: "Search events or teams",
        searchPlaceholder: "e.g. Real Madrid",
        bookmakerLabel: "Bookmaker",
        minProfitLabel: "Minimum profit (%)",
        minProfitPlaceholder: "e.g. 2.5",
        adjustMinProfit: "Adjust minimum profit",
        incrementMinProfit: "Increase minimum profit",
        decrementMinProfit: "Decrease minimum profit",
        betTypeLabel: "Arbitrage type",
        sortLabel: "Sort by",
      },
      bankSidebar: {
        ariaLabel: "Bank management",
        title: "Available bank",
        description: "We use your bank to calculate the suggested stakes.",
        close: "Close bank panel",
        capitalLabel: "Bank capital",
        shortcutsAria: "Shortcuts to adjust the bank",
      },
      list: {
        heading: "Arbitrage opportunities",
        sportSuffix: "in",
        loadingLive: "Loading live arbitrages...",
        noResultsFiltered:
          "We couldn't find arbitrages that match the selected filters.",
        noResults: "No arbitrage opportunities are available right now.",
        loadingOverlay: "Loading arbitrages...",
      },
      card: {
        ariaLabel: "Arbitrage {{id}}",
        newBadge: "New",
        betInfo: {
          stake: "Stake",
          liability: "Liability",
          back: "Back",
          lay: "Lay",
        },
        homePrefix: "Home",
        awayPrefix: "Away",
      },
      sportToggle: {
        title: "Toggle sports",
        open: "Open filters",
        close: "Close filters",
      },
      sports: {
        all: "All",
        football: "Football",
        basketball: "Basketball",
        tennis: "Tennis",
        volleyball: "Volleyball",
        hockey: "Hockey",
        baseball: "Baseball",
        rugby: "Rugby",
        other: "Other",
      },
    },
  },
  es: {
    languageNames: {
      en: "Inglés",
      es: "Español",
    },
    header: {
      public: {
        goToAccount: "Ir a tu cuenta",
        goToPanel: "Ir al panel",
      },
      private: {
        defaultUser: "Usuario",
        settings: "Configuración",
        signOut: "Cerrar sesión",
      },
    },
    auth: {
      titles: {
        login: "Iniciar sesión",
        register: "Crear cuenta",
        forgot: "Recuperar contraseña",
      },
      placeholders: {
        email: "Correo electrónico",
        password: "Contraseña",
      },
      regionLabel: "Selecciona tu región de apuestas",
      regionOptions: {
        EU: "Europa (EU)",
        UK: "Reino Unido (UK)",
      },
      forgotInstructions:
        "Introduce tu correo electrónico para enviarte un enlace seguro de restablecimiento.",
      success: {
        reset: "Te hemos enviado un enlace seguro para restablecer tu contraseña. Revisa tu bandeja de entrada.",
        register:
          "Cuenta creada. Revisa tu email y valida tu cuenta para poder acceder de forma segura al panel.",
        login: "Sesión iniciada correctamente. Redirigiendo al panel...",
      },
      buttons: {
        sendReset: "Enviar enlace de recuperación",
        register: "Registrarse",
        login: "Entrar",
        continue: "Continuar",
        dismiss: "Entendido, revisaré mi correo",
      },
      links: {
        haveAccount: "¿Ya tienes cuenta? Inicia sesión",
        needAccount: "¿Aún no tienes cuenta? Regístrate",
        forgotPassword: "¿Olvidaste tu contraseña?",
        backToLogin: "Volver a iniciar sesión",
      },
      errors: {
        regionRequired: "Selecciona tu región de apuestas para continuar.",
        genericSignIn: "No se pudo iniciar la sesión.",
      },
    },
    landing: {
      hero: {
        titlePrefix: "Convierte el riesgo en beneficio con ",
        highlight: "SureVisionOne",
        subtitle:
          "El escáner de arbitraje más rápido para apuestas deportivas. Encuentra apuestas seguras y garantiza ganancias sin riesgo.",
        cta: "Comenzar gratis",
      },
      featuresTitle: "Características que garantizan el éxito",
      arbitrageTitle: "Oportunidades de arbitraje",
      pricingTitle: "Planes de suscripción flexibles",
      footer: "Todos los derechos reservados.",
      features: [
        {
          title: "Arbitraje en Tiempo Real",
          description:
            "Escaneo ultrarrápido a través de más de 80 casas de apuestas y exchanges para no perderte ni una oportunidad.",
        },
        {
          title: "Seguimiento de Beneficios",
          description:
            "Visualiza tus ganancias y pérdidas históricas, rendimiento por deporte y análisis detallado de ROI.",
        },
        {
          title: "Seguridad y Transparencia",
          description:
            "Cálculos verificados y encriptación de datos para garantizar la seguridad de tu información financiera.",
        },
        {
          title: "Calculadora Integrada",
          description:
            "Ajusta automáticamente las apuestas 'back' y 'lay' basándose en tu bankroll disponible.",
        },
      ],
      pricingPlans: [
        {
          name: "Free",
          price: { eur: 0, gbp: 0 },
          tagline: "Acceso permanente a la plataforma con arbitrajes básicos.",
          features: [
            "Escaneo en 5 casas de apuestas",
            "Arbitrajes con beneficio > 3.0%",
            "Retraso de datos de 30 minutos",
            "Soporte por documentación",
          ],
          isFree: true,
          cta: "Empezar gratis",
        },
        {
          name: "Starter",
          price: { eur: 29, gbp: 25 },
          tagline: "Ideal para principiantes que empiezan a explorar el arbitraje.",
          features: [
            "Escaneo en 20+ casas de apuestas",
            "Arbitrajes con beneficio > 1.5%",
            "Notificaciones por email",
            "Soporte estándar",
          ],
          cta: "Seleccionar Starter",
        },
        {
          name: "Pro",
          price: { eur: 99, gbp: 85 },
          tagline: "Herramientas avanzadas para arbitrajistas a tiempo parcial.",
          features: [
            "Escaneo en 80+ casas de apuestas",
            "Arbitrajes con beneficio > 0%",
            "Notificaciones instantáneas (SMS/Telegram)",
            "Calculadora de arbitraje avanzada",
            "Soporte premium 24/7",
          ],
          isPopular: true,
          cta: "Comenzar con Pro",
        },
        {
          name: "Ultimate",
          price: { eur: 199, gbp: 169 },
          tagline: "Máxima velocidad y acceso a arbitrajes en tiempo real y trading.",
          features: [
            "Escaneo en 100+ plataformas (incluye exchanges)",
            "Arbitrajes Pre-partido y Live",
            "Arbitrajes con beneficio > 0%",
            "API de Integración (Beta)",
            "Asesor personalizado",
          ],
          cta: "Contactar",
        },
      ],
    },
    panel: {
      loading: "Cargando sesión segura...",
      verify: {
        heading: "Verifica tu correo electrónico para activar el acceso seguro",
        descriptionBeforeEmail: "Hemos enviado un mensaje de confirmación a ",
        descriptionAfterEmail:
          ". Una vez que valides tu cuenta, podrás acceder al panel con todas las medidas de seguridad activadas.",
        infoSpam:
          "Si no encuentras el correo, revisa tu carpeta de spam o promociones y marca el mensaje como seguro.",
        infoConfirm:
          "Tras confirmar, vuelve aquí y presiona el enlace inferior para verificar el estado de tu cuenta.",
        buttonIdle: "Ya verifiqué mi correo",
        buttonLoading: "Comprobando verificación...",
        messageUnverified:
          "Tu cuenta todavía no figura validada. Revisa tu correo o intenta de nuevo en unos instantes.",
        messageVerified: "Validación confirmada. Redirigiéndote al panel seguro...",
        messageGenericError: "No se pudo comprobar el estado de la cuenta. Inténtalo más tarde.",
      },
    },
    profile: {
      back: "Volver",
      headerBadge: "Panel del usuario",
      headerTitle: "Tu perfil",
      headerDescription:
        "Administra la información asociada a tu cuenta, ajusta la seguridad y revisa el estado de tu suscripción.",
      mainCard: {
        title: "Información principal",
        description: "Estos datos son privados y sólo tú puedes verlos.",
        fullName: "Nombre completo",
        email: "Correo electrónico",
        language: "Idioma preferido",
        activePlan: "Plan activo",
        planStatus: "Estado del plan",
        renewal: "Próxima renovación",
      },
      securityCard: {
        title: "Seguridad",
        description: "Cambiar tu contraseña ayuda a mantener la cuenta protegida.",
      },
      passwordForm: {
        current: "Contraseña actual",
        next: "Nueva contraseña",
        confirm: "Confirmar nueva contraseña",
        submit: "Actualizar contraseña",
        submitting: "Actualizando...",
      },
      planCard: {
        titlePrefix: "Tu plan",
        titleSuffix: "",
        opportunities: "Oportunidades al día",
        alerts: "Alertas disponibles",
        refresh: "Actualización de datos",
        refreshEvery: "Cada",
        refreshUnit: "min",
      },
      dangerCard: {
        title: "Zona de riesgo",
        description: "Eliminar la cuenta es irreversible.",
        body:
          "Esta acción eliminará tu cuenta y tu método de pago, y no podrás restaurarlos posteriormente.",
        delete: "Eliminar cuenta",
        processing: "Procesando...",
      },
      alertDismiss: "Cerrar",
      feedback: {
        passwordMissingFields: "Completa todos los campos para actualizar tu contraseña.",
        passwordMismatch: "Las contraseñas nuevas no coinciden.",
        passwordRequirements:
          "La contraseña debe tener al menos 12 caracteres e incluir al menos una letra minúscula, una mayúscula y un número.",
        passwordMissingEmail:
          "No pudimos encontrar tu correo electrónico para validar la contraseña.",
        passwordIncorrectCurrent: "La contraseña actual no es correcta.",
        passwordValidateFailed: "No se pudo validar tu contraseña actual.",
        passwordInvalidNew: "La nueva contraseña no cumple los requisitos de seguridad.",
        passwordUpdateFailed: "No se pudo actualizar la contraseña.",
        passwordUpdated: "Tu contraseña se actualizó correctamente.",
        upgradeInfo:
          "Te mostraremos los planes disponibles en la página principal para que puedas evaluar un upgrade.",
        deleteConfirm:
          "Esta acción eliminará tu cuenta y tus datos asociados. ¿Deseas continuar?",
        deleteSessionCheck: "No se pudo verificar la sesión actual.",
        deleteTokenMissing: "No se pudo validar tu sesión para eliminar la cuenta.",
        deleteFailed: "No se pudo eliminar la cuenta.",
        deleteSuccess: "Tu cuenta se eliminó correctamente. Te redirigiremos al inicio.",
      },
      planLibrary: {
        Free: {
          description:
            "Plan gratuito para conocer las funciones esenciales antes de dar el salto a una suscripción de pago.",
          features: [
            "Alertas básicas de arbitraje cada 30 minutos",
            "Seguimiento de pocas oportunidades favoritas",
            "Acceso a documentación y comunidad",
          ],
          cta: "Descubre planes con más automatización",
        },
        Starter: {
          description:
            "Pensado para traders que operan varias veces por semana y necesitan un poco más de contexto.",
          features: [
            "Cobertura de más casas de apuestas",
            "Alertas por correo para oportunidades destacadas",
            "Historial exportable en CSV",
          ],
          cta: "Mejora tu velocidad con el plan Pro",
        },
        Pro: {
          description:
            "Incluye métricas avanzadas y sincronización casi en tiempo real para los que operan a diario.",
          features: [
            "Actualizaciones cada pocos minutos",
            "Notificaciones push y vía Telegram",
            "Panel de análisis con comparativas por deporte",
          ],
          cta: "Solicita acceso a Ultimate para automatizar más",
        },
        Ultimate: {
          description:
            "Suite completa con acceso API y soporte personalizado 24/7 para equipos profesionales.",
          features: [
            "Arbitraje live sin restricciones",
            "Workflows automatizados y límites ampliados",
            "Gestor de cuenta dedicado",
          ],
          cta: "Contacta con nosotros para escalar tu operación",
        },
      },
    },
    arbitrage: {
      currency: {
        locale: "es-ES",
        currency: "EUR",
        symbol: "€",
      },
      mobile: {
        filters: "Filtros",
        bank: "Capital",
      },
      defaults: {
        bookmakerAll: "Todas las casas",
        betTypesAll: "Todos los tipos de arbitraje",
      },
      sortOptions: {
        profitDesc: "Rentabilidad (mayor a menor)",
        profitAsc: "Rentabilidad (menor a mayor)",
        matchAz: "Partido (A-Z)",
        matchZa: "Partido (Z-A)",
      },
      filtersToolbar: {
        ariaLabel: "Filtros avanzados",
        refineResults: "Refinar resultados",
        close: "Cerrar filtros",
        reset: "Reiniciar filtros",
        sportLabel: "Deporte",
        sportAria: "Filtrar por deporte",
        searchLabel: "Buscar eventos o equipos",
        searchPlaceholder: "Ej. Real Madrid",
        bookmakerLabel: "Casa de apuesta",
        minProfitLabel: "Rentabilidad mínima (%)",
        minProfitPlaceholder: "Ej. 2.5",
        adjustMinProfit: "Ajustar rentabilidad mínima",
        incrementMinProfit: "Incrementar rentabilidad mínima",
        decrementMinProfit: "Reducir rentabilidad mínima",
        betTypeLabel: "Tipo de arbitraje",
        sortLabel: "Ordenar por",
      },
      bankSidebar: {
        ariaLabel: "Gestión de capital",
        title: "Capital disponible",
        description: "Usamos tu bank para calcular las apuestas sugeridas.",
        close: "Cerrar panel de bank",
        capitalLabel: "Capital (Bank)",
        shortcutsAria: "Atajos para ajustar el bank",
      },
      list: {
        heading: "Oportunidades de arbitraje",
        sportSuffix: "en",
        loadingLive: "Cargando arbitrajes en tiempo real...",
        noResultsFiltered:
          "No encontramos arbitrajes que coincidan con los filtros seleccionados.",
        noResults: "No hay oportunidades de arbitraje disponibles en este momento.",
        loadingOverlay: "Cargando arbitrajes...",
      },
      card: {
        ariaLabel: "Arbitraje {{id}}",
        newBadge: "Nuevo",
        betInfo: {
          stake: "Stake",
          liability: "Responsabilidad",
          back: "Back",
          lay: "Lay",
        },
        homePrefix: "Local",
        awayPrefix: "Visitante",
      },
      sportToggle: {
        title: "Filtrar deportes",
        open: "Abrir filtros",
        close: "Cerrar filtros",
      },
      sports: {
        all: "Todos",
        football: "Fútbol",
        basketball: "Baloncesto",
        tennis: "Tenis",
        volleyball: "Voleibol",
        hockey: "Hockey",
        baseball: "Béisbol",
        rugby: "Rugby",
        other: "Otros",
      },
    },
  },
};

export type { AppTranslations, LandingCopy, PricingPlan, PanelCopy, ProfileCopy, ArbitrageCopy, AuthCopy };
