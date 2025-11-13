const RECOVERY_COOKIE = "sv-recovery-session";

const resolveCookieAttributes = () => {
  if (typeof window === "undefined") {
    return "Path=/; SameSite=Lax";
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  return `Path=/; SameSite=Lax${secure}`;
};

export const markRecoverySession = () => {
  if (typeof document === "undefined") return;

  const attributes = resolveCookieAttributes();
  // Cookie válida durante 15 minutos, suficiente para completar el flujo
  document.cookie = `${RECOVERY_COOKIE}=1; Max-Age=900; ${attributes}`;
};

export const clearRecoverySessionMark = () => {
  if (typeof document === "undefined") return;

  const attributes = resolveCookieAttributes();
  document.cookie = `${RECOVERY_COOKIE}=; Max-Age=0; ${attributes}`;
};
