"use client";

import Link from "next/link";
import { useState } from "react";
import { useDb } from "@/lib/store/store";
import { allViews } from "@/lib/views";
import { formatCents } from "@/lib/domain/money";
import { formatDate } from "@/lib/domain/dates";
import { Button, Card, EmptyState, StateBadge } from "@/components/ui";

type Filter = "OUTSTANDING" | "ALL" | "DISPUTED" | "CLOSED";

export default function FeeNotesPage() {
  const db = useDb();
  const [filter, setFilter] = useState<Filter>("OUTSTANDING");

  const views = allViews(db).filter((v) => {
    switch (filter) {
      case "OUTSTANDING":
        return (
          v.fn.state !== "SETTLED" &&
          v.fn.state !== "WRITTEN_OFF" &&
          v.fn.state !== "DRAFT"
        );
      case "DISPUTED":
        return v.fn.state === "DISPUTED";
      case "CLOSED":
        return v.fn.state === "SETTLED" || v.fn.state === "WRITTEN_OFF";
      default:
        return true;
    }
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">Fee notes</h1>
        <div className="flex gap-2">
          <Link href="/ingest" className="contents">
            <Button variant="secondary">From email</Button>
          </Link>
          <Link href="/import" className="contents">
            <Button variant="secondary">Import CSV</Button>
          </Link>
          <Link href="/fee-notes/new" className="contents">
            <Button>New</Button>
          </Link>
        </div>
      </div>

      <div className="mb-3 flex gap-1 overflow-x-auto">
        {(
          [
            ["OUTSTANDING", "Outstanding"],
            ["DISPUTED", "Disputed"],
            ["CLOSED", "Closed"],
            ["ALL", "All"],
          ] as [Filter, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
              filter === key
                ? "bg-brand text-white"
                : "bg-white text-gray-600 ring-1 ring-black/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {views.length === 0 ? (
        <EmptyState title="No fee notes here">
          <Link href="/import" className="text-brand underline">
            Import your existing book
          </Link>{" "}
          or create one.
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {views.map((v) => (
            <Link key={v.fn.id} href={`/fee-notes/${v.fn.id}`} className="block">
              <Card className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {v.fn.number} · {v.matter?.title ?? "(no matter)"}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {v.firm?.name ?? "—"} · issued {formatDate(v.fn.issueDate)} ·{" "}
                    {v.ageDays}d
                  </p>
                  <div className="mt-1">
                    <StateBadge state={v.fn.state} paused={v.fn.paused} />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCents(v.outstandingCents)}
                  </p>
                  {v.paidCents > 0 && (
                    <p className="text-[11px] text-gray-500">
                      {formatCents(v.paidCents)} paid
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
