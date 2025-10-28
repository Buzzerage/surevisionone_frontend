import { FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordFormProps = {
  values: PasswordFormValues;
  onChange: (field: keyof PasswordFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
};

const PasswordField = ({
  id,
  label,
  onChange,
  value,
  autoComplete,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
  autoComplete: string;
}) => (
  <label className="block text-sm text-[var(--color-text-secondary)]">
    <span>{label}</span>
    <input
      id={id}
      type="password"
      value={value}
      autoComplete={autoComplete}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-tertiary)] px-3 py-2 text-[var(--color-text-accent)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-primary)]"
      placeholder="••••••••"
    />
  </label>
);

const PasswordForm = ({ onChange, onSubmit, submitting, values }: PasswordFormProps) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <PasswordField
      id="current-password"
      label="Contraseña actual"
      autoComplete="current-password"
      value={values.currentPassword}
      onChange={(value) => onChange("currentPassword", value)}
    />
    <PasswordField
      id="new-password"
      label="Nueva contraseña"
      autoComplete="new-password"
      value={values.newPassword}
      onChange={(value) => onChange("newPassword", value)}
    />
    <PasswordField
      id="confirm-password"
      label="Confirmar nueva contraseña"
      autoComplete="new-password"
      value={values.confirmPassword}
      onChange={(value) => onChange("confirmPassword", value)}
    />
    <button
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0ea5e9] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={submitting}
    >
      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
      {submitting ? "Actualizando..." : "Actualizar contraseña"}
    </button>
  </form>
);

export type { PasswordFormValues };
export default PasswordForm;