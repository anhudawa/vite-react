"use client";

import Link from "next/link";
import { getStore, useDb } from "@/lib/store/store";
import { formatDate } from "@/lib/domain/dates";
import { formatCents } from "@/lib/domain/money";
import { Button, Card, EmptyState } from "@/components/ui";

export default function MattersPage() {
  const db = useDb();
  const store = getStore();

  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold">Matters</h1>
      <p className="mb-4 text-xs text-gray-500">
        Section 150 costs notices are tracked per matter — the compliance hook
        that makes this the start of every matter, not just the recovery end.
      </p>
      {db.matters.length === 0 ? (
        <EmptyState title="No matters yet">
          Matters are created with fee notes, or when you import.
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {db.matters.map((m) => {
            const firm = db.firms.find((f) => f.id === m.firmId);
            const notes = db.feeNotes.filter((fn) => fn.matterId === m.id);
            const totalCents = notes.reduce((s, fn) => s + fn.amountCents, 0);
            return (
              <Card key={m.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {m.title}
                      {m.reference && (
                        <span className="font-normal text-gray-500"> · {m.reference}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {firm?.name ?? "—"} · {notes.length} fee note(s) ·{" "}
                      {formatCents(totalCents)}
                    </p>
                    <p className="mt-1 text-xs">
                      {m.section150 ? (
                        <span className="text-green-700">
                          s.150 issued {formatDate(m.section150.issuedAt)}
                          {m.section150.deliveryConfirmedAt
                            ? " · delivery confirmed"
                            : " · delivery unconfirmed"}
                        </span>
                      ) : (
                        <span className="text-amber-700">No s.150 notice recorded</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {m.section150 ? (
                      <>
                        <Link href={`/matters/${m.id}/s150`} className="contents">
                          <Button variant="secondary">View notice</Button>
                        </Link>
                        {!m.section150.deliveryConfirmedAt && (
                          <Button
                            variant="ghost"
                            onClick={() => store.confirmSection150Delivery(m.id)}
                          >
                            Confirm delivery
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button variant="secondary" onClick={() => store.issueSection150(m.id)}>
                        Issue s.150 notice
                      </Button>
                    )}
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
