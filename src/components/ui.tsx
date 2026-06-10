"use client";

import { FeeNoteState } from "@/lib/domain/types";

const STATE_STYLES: Record<FeeNoteState, { label: string; dot: string }> = {
  DRAFT: { label: "Draft", dot: "bg-ink-faint" },
  ISSUED: { label: "Issued", dot: "bg-brand" },
  REMINDER_1: { label: "Reminder 1 sent", dot: "bg-accent" },
  REMINDER_2: { label: "Reminder 2 sent", dot: "bg-accent" },
  FORMAL_LETTER: { label: "Formal letter sent", dot: "bg-danger" },
  RECOVERY_DECISION: { label: "Recovery decision", dot: "bg-danger" },
  BAR_REFERRAL_PACK: { label: "Bar referral active", dot: "bg-brand-deep" },
  LSRA_COMPLAINT_PACK: { label: "LSRA complaint", dot: "bg-brand-deep" },
  SETTLED: { label: "Settled", dot: "bg-brand" },
  WRITTEN_OFF: { label: "Written off", dot: "bg-ink-faint" },
  DISPUTED: { label: "Disputed", dot: "bg-danger" },
};

export function StateBadge({
  state,
  paused,
}: {
  state: FeeNoteState;
  paused?: boolean;
}) {
  const s = STATE_STYLES[state];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-soft">
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
        {s.label}
      </span>
      {paused && (
        <span className="inline-flex items-center rounded-full border border-line bg-paper px-2 py-0.5 text-[11px] font-medium text-ink-faint">
          Paused
        </span>
      )}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(28,37,34,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Page heading: serif display title, optional subtitle and actions. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-prose text-sm text-ink-soft">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 mt-7 flex items-center gap-3" role="heading" aria-level={2}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {children}
      </span>
      <span className="h-px flex-1 bg-line" aria-hidden />
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary:
      "bg-brand text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(15,43,38,0.25)] hover:bg-brand-deep",
    secondary:
      "border border-line-strong bg-surface text-ink shadow-[0_1px_2px_rgba(28,37,34,0.04)] hover:border-brand hover:text-brand",
    danger:
      "bg-danger text-white shadow-[0_1px_2px_rgba(150,52,58,0.25)] hover:brightness-95",
    ghost: "text-brand hover:bg-brand-light",
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-md border border-line-strong bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong bg-surface/60 p-10 text-center">
      <p className="font-display text-base font-medium text-ink">{title}</p>
      {children && <div className="mt-2 text-sm text-ink-soft">{children}</div>}
    </div>
  );
}
