"use client";

import { FeeNoteState } from "@/lib/domain/types";

const STATE_STYLES: Record<FeeNoteState, { label: string; cls: string }> = {
  DRAFT: { label: "Draft", cls: "bg-gray-100 text-gray-600" },
  ISSUED: { label: "Issued", cls: "bg-blue-50 text-blue-700" },
  REMINDER_1: { label: "Reminder 1 sent", cls: "bg-amber-50 text-amber-700" },
  REMINDER_2: { label: "Reminder 2 sent", cls: "bg-amber-100 text-amber-800" },
  FORMAL_LETTER: { label: "Formal letter sent", cls: "bg-orange-100 text-orange-800" },
  RECOVERY_DECISION: { label: "Recovery decision", cls: "bg-red-50 text-red-700" },
  BAR_REFERRAL_PACK: { label: "Bar referral active", cls: "bg-purple-50 text-purple-700" },
  LSRA_COMPLAINT_PACK: { label: "LSRA complaint", cls: "bg-purple-100 text-purple-800" },
  SETTLED: { label: "Settled", cls: "bg-green-50 text-green-700" },
  WRITTEN_OFF: { label: "Written off", cls: "bg-gray-100 text-gray-500" },
  DISPUTED: { label: "Disputed", cls: "bg-rose-100 text-rose-800" },
};

export function StateBadge({ state, paused }: { state: FeeNoteState; paused?: boolean }) {
  const s = STATE_STYLES[state];
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${s.cls}`}
      >
        {s.label}
      </span>
      {paused && (
        <span className="inline-block rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-600">
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
      className={`rounded-xl border border-black/10 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </h2>
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
    primary: "bg-[--color-brand] text-white hover:opacity-90",
    secondary: "border border-black/15 bg-white text-[--color-ink] hover:bg-gray-50",
    danger: "bg-[--color-danger] text-white hover:opacity-90",
    ghost: "text-[--color-brand] hover:bg-[--color-brand-light]",
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
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
      <span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm focus:border-[--color-brand] focus:outline-none";

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-black/15 bg-white/60 p-8 text-center">
      <p className="font-medium text-gray-700">{title}</p>
      {children && <div className="mt-3 text-sm text-gray-500">{children}</div>}
    </div>
  );
}
