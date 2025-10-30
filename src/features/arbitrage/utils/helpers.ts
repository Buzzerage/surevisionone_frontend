// Utilidades comunes para la vista de arbitrajes

const toDate = (value?: string | Date | null): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const minutesToMs = (minutes: number) => minutes * 60 * 1000;

export const timeUntilExpiry = (
  value: string | Date | null | undefined,
  minutes: number
) => {
  const reference = toDate(value);
  if (!reference) {
    return minutesToMs(minutes);
  }
  const expiry = reference.getTime() + minutesToMs(minutes);
  return Math.max(0, expiry - Date.now());
};

export const isRecent = (
  value: string | Date | null | undefined,
  minutes: number = 5
): boolean => {
  const reference = toDate(value);
  if (!reference) {
    return false;
  }

  const now = Date.now();
  const delta = now - reference.getTime();
  if (delta < 0) {
    // Si la fecha viene en el futuro (ej. por desfase horario) no mostramos la etiqueta
    return false;
  }
  return delta <= minutesToMs(minutes);
};

