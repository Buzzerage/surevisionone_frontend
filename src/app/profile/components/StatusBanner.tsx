import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import type { FeedbackState, FeedbackTone } from "../types";

const FEEDBACK_STYLES: Record<FeedbackTone, {
  container: string;
  text: string;
  iconColor: string;
  dismiss: string;
  Icon: typeof Info;
}> = {
  success: {
    container: "border-[var(--color-success-border)] bg-[var(--color-success-surface)]",
    text: "text-[var(--color-success-text)]",
    iconColor: "text-[var(--color-success-text)]",
    dismiss: "text-[var(--color-success-text)]",
    Icon: CheckCircle2,
  },
  info: {
    container: "border-[var(--color-info-border)] bg-[var(--color-info-surface)]",
    text: "text-[var(--color-info-text)]",
    iconColor: "text-[var(--color-info-text)]",
    dismiss: "text-[var(--color-info-text)]",
    Icon: Info,
  },
  warning: {
    container: "border-[var(--color-warning-border)] bg-[var(--color-warning-surface)]",
    text: "text-[var(--color-warning-text)]",
    iconColor: "text-[var(--color-warning-text)]",
    dismiss: "text-[var(--color-warning-text)]",
    Icon: AlertTriangle,
  },
  error: {
    container: "border-[var(--color-danger-border)] bg-[var(--color-danger-surface)]",
    text: "text-[var(--color-danger-text)]",
    iconColor: "text-[var(--color-danger-text)]",
    dismiss: "text-[var(--color-danger-text)]",
    Icon: XCircle,
  },
};

type StatusBannerProps = {
  feedback: FeedbackState | null;
  onDismiss: () => void;
};

const StatusBanner = ({ feedback, onDismiss }: StatusBannerProps) => {
  if (!feedback) return null;

  const palette = FEEDBACK_STYLES[feedback.type];
  const { Icon } = palette;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-[0_18px_35px_-20px_var(--color-card-glow)] backdrop-blur-sm ${palette.container}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${palette.iconColor}`} />
      <p className={`flex-1 leading-relaxed ${palette.text}`}>{feedback.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className={`text-xs font-semibold uppercase tracking-wide underline decoration-dotted transition-colors hover:opacity-80 ${palette.dismiss}`}
      >
        Cerrar
      </button>
    </div>
  );
};

export default StatusBanner;