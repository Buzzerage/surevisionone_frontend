import type { ReactNode } from "react";

const toneStyles = {
  default: {
    container:
      "border-[var(--color-border)] bg-[linear-gradient(135deg,var(--card-bg-gradient-start),var(--card-bg-gradient-end))] shadow-[0_25px_50px_-25px_var(--color-card-glow)]",
    icon: "bg-[var(--color-background-tertiary)] text-[var(--color-accent-primary)]",
    title: "text-[var(--color-text-accent)]",
    description: "text-[var(--color-text-secondary)]",
  },
  danger: {
    container:
      "border-[var(--color-danger-strong-border)] bg-[var(--color-danger-strong-surface)] shadow-[0_20px_45px_-20px_var(--color-card-glow)]",
    icon: "bg-[var(--color-danger-surface)] text-[var(--color-danger-text)]",
    title: "text-[var(--color-danger-strong-text)]",
    description: "text-[var(--color-danger-text)]",
  },
} as const;

type ProfileCardProps = {
  children: ReactNode;
  description?: string;
  icon: ReactNode;
  title: string;
  tone?: keyof typeof toneStyles;
};

const ProfileCard = ({ children, description, icon, title, tone = "default" }: ProfileCardProps) => {
  const palette = toneStyles[tone];

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${palette.container} hover:shadow-[0_32px_70px_-28px_var(--color-card-glow)]`}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-inner shadow-black/10 ${palette.icon}`}>
          {icon}
        </div>
        <div>
          <h2 className={`text-xl font-semibold tracking-tight ${palette.title}`}>{title}</h2>
          {description ? (
            <p className={`mt-1 text-sm leading-relaxed ${palette.description}`}>{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </article>
  );
};

export default ProfileCard;