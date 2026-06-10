"use client";

import { plural } from "@/lib/plural";

import Link from "next/link";
import { useDb, getStore } from "@/lib/store/store";
import { summariseAgeing } from "@/lib/domain/ageing";
import { formatCents, formatCentsCompact } from "@/lib/domain/money";
import { stepLabel } from "@/lib/domain/pack";
import { todayISO } from "@/lib/domain/dates";
import {
  awaitingApproval,
  firmRollups,
  missedInstalments,
  outstandingViews,
  paidCentsByFeeNote,
} from "@/lib/views";
import { Button, Card, EmptyState, SectionTitle, StateBadge } from "@/components/ui";

export default function Dashboard() {
  const db = useDb();
  const hasData = db.feeNotes.length > 0;

  if (!hasData) {
    return (
      <div className="mx-auto mt-12 max-w-md space-y-5">
        <h1 className="text-center font-display text-[1.75rem] font-semibold leading-snug tracking-tight">
          Get paid without being the
          <br />
          one doing the chasing
        </h1>
        <p className="text-center text-sm leading-relaxed text-ink-soft">
          Start by capturing your existing outstanding fees — the dashboard
          only earns its keep once your aged debt is in it.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/import" className="contents">
            <Button className="w-full">Import existing fee notes (CSV)</Button>
          </Link>
          <Link href="/ingest" className="contents">
            <Button variant="secondary" className="w-full">
              Forward a fee note email
            </Button>
          </Link>
          <Link href="/fee-notes/new" className="contents">
            <Button variant="secondary" className="w-full">
              Create a fee note
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => getStore().loadDemoData()}>
            Or load the demo practice book
          </Button>
        </div>
      </div>
    );
  }

  const ageing = summariseAgeing(db.feeNotes, paidCentsByFeeNote(db));
  const queue = awaitingApproval(db);
  const reminder1Due = outstandingViews(db).filter(
    (v) =>
      v.proposed?.kind === "SEND_STEP" &&
      v.proposed.step === "REMINDER_1" &&
      v.proposed.due,
  );
  const firms = firmRollups(db).filter((f) => f.outstandingCents > 0);
  const maxBand = Math.max(1, ...ageing.bands.map((b) => b.cents));
  const disputed = outstandingViews(db).filter((v) => v.fn.state === "DISPUTED");
  const missed = missedInstalments(db, todayISO());

  return (
    <div className="space-y-1">
      {/* Headline: one thumb, ten seconds, full picture. Not a <Card> —
          its bg-white would tie with bg-brand and win by stylesheet order. */}
      <div className="relative overflow-hidden rounded-lg bg-brand-deep p-5 text-white shadow-[0_2px_8px_rgba(15,43,38,0.25)]">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
        />
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
          Total outstanding
        </p>
        <p className="mt-1.5 font-display text-[2.6rem] font-semibold leading-none tracking-tight tabular-nums">
          {formatCents(ageing.totalOutstandingCents)}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/65">
          <span>
            <span className="font-semibold text-white">
              {outstandingViews(db).length}
            </span>{" "}
            fee notes
          </span>
          {disputed.length > 0 && (
            <span>
              <span className="font-semibold text-white">{disputed.length}</span>{" "}
              disputed
            </span>
          )}
          <span>
            <span className="font-semibold text-white">{queue.length}</span>{" "}
            awaiting your decision
          </span>
        </div>
      </div>

      {queue.length > 0 && (
        <>
          <SectionTitle>Needs your approval</SectionTitle>
          <div className="space-y-2">
            {queue.map((v) => (
              <Link key={v.fn.id} href={`/fee-notes/${v.fn.id}`} className="block">
                <Card className="flex items-center justify-between gap-3 border-l-4 border-l-accent">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {v.fn.number} · {v.firm?.name ?? "—"}
                    </p>
                    <p className="truncate text-xs text-ink-soft">
                      {v.proposed?.kind === "RECOVERY_DECISION"
                        ? "Ladder exhausted — choose Bar referral or LSRA complaint"
                        : v.proposed?.kind === "SEND_STEP"
                          ? `${stepLabel(v.proposed.step)} proposed (due ${v.proposed.dueDate})`
                          : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatCentsCompact(v.outstandingCents)}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {missed.length > 0 && (
        <>
          <SectionTitle>Missed instalments</SectionTitle>
          <div className="space-y-2">
            {missed.map((m) => (
              <Link key={m.view.fn.id} href={`/fee-notes/${m.view.fn.id}`} className="block">
                <Card className="flex items-center justify-between gap-3 border-l-4 border-l-danger py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {m.view.fn.number} · {m.view.firm?.name ?? "—"}
                    </p>
                    <p className="text-xs text-ink-soft">
                      Payment plan behind since {m.dueDate}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-danger">
                    {formatCentsCompact(m.shortfallCents)} short
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {reminder1Due.length > 0 && (
        <p className="pt-2 text-xs text-ink-soft">
          {plural(reminder1Due.length, "first reminder")} will go out automatically
          on schedule — no action needed.
        </p>
      )}

      <SectionTitle>Ageing</SectionTitle>
      <Card>
        <div className="space-y-2">
          {ageing.bands.map((band) => (
            <div key={band.key} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-ink-soft">
                {band.label}
              </span>
              <div className="h-5 flex-1 overflow-hidden rounded bg-paper">
                <div
                  className={`h-full rounded ${
                    band.key === "91-180" || band.key === "180+"
                      ? "bg-danger"
                      : band.key === "61-90"
                        ? "bg-accent"
                        : "bg-brand"
                  }`}
                  style={{ width: `${(band.cents / maxBand) * 100}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-xs font-medium tabular-nums">
                {band.cents > 0 ? formatCentsCompact(band.cents) : "—"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <SectionTitle>By firm</SectionTitle>
      <div className="space-y-2">
        {firms.map((r) => (
          <Link key={r.firm.id} href="/firms" className="block">
            <Card className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{r.firm.name}</p>
                <p className="text-xs text-ink-soft">
                  {plural(r.noteCount, "note")} · oldest {r.oldestAgeDays} days
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {formatCents(r.outstandingCents)}
              </span>
            </Card>
          </Link>
        ))}
      </div>

      <SectionTitle>Oldest outstanding</SectionTitle>
      <div className="space-y-2">
        {outstandingViews(db)
          .slice(0, 5)
          .map((v) => (
            <Link key={v.fn.id} href={`/fee-notes/${v.fn.id}`} className="block">
              <Card className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {v.fn.number} · {v.matter?.title ?? "—"}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-soft">
                    <StateBadge state={v.fn.state} paused={v.fn.paused} />
                    <span>{v.ageDays} days</span>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatCentsCompact(v.outstandingCents)}
                </span>
              </Card>
            </Link>
          ))}
      </div>

      {queue.length === 0 && (
        <EmptyState title="Nothing waiting on you">
          The ladder runs on schedule; you’ll be asked before anything beyond a
          first reminder goes out.
        </EmptyState>
      )}
    </div>
  );
}
