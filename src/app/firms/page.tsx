"use client";

import { useDb } from "@/lib/store/store";
import { firmRollups } from "@/lib/views";
import { formatCents } from "@/lib/domain/money";
import { meanDaysToPay, paymentBandLabel } from "@/lib/domain/stats";
import { Card, EmptyState } from "@/components/ui";

export default function FirmsPage() {
  const db = useDb();
  const rollups = firmRollups(db);

  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold">Solicitor firms</h1>
      <p className="mb-4 text-xs text-gray-500">
        Payment behaviour is computed from your own fee notes only. Cross-user
        benchmarks are a Phase 2 feature gated on legal review.
      </p>
      {rollups.length === 0 ? (
        <EmptyState title="No firms yet">
          Firms are created automatically when you add or import fee notes.
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {rollups.map((r) => {
            const mean = meanDaysToPay(r.firm.stats);
            return (
              <Card key={r.firm.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.firm.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {paymentBandLabel(r.firm.stats)}
                      {mean !== null && ` · avg ${mean} days over ${r.firm.stats.paidCount} paid`}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatCents(r.outstandingCents)}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {r.noteCount} outstanding
                      {r.oldestAgeDays > 0 && ` · oldest ${r.oldestAgeDays}d`}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
