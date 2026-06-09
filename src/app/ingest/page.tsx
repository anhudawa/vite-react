"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getStore, useDb } from "@/lib/store/store";
import { heuristicParse, ParsedFeeNote } from "@/lib/domain/emailParse";
import { parseAmountToCents } from "@/lib/domain/money";
import { Button, Card, Field, inputCls } from "@/components/ui";

const SAMPLE_EMAIL = `Fwd: Re: O'Brien v Galtee Logistics Ltd (ref MH-2241) — fee note

Dear Claire,

Please find attached my fee note dated 14/03/2026 in the above matter,
covering drafting of the personal injuries summons and advice on proofs.

Fee: €2,500.00 (plus VAT where applicable)

Kind regards,
Aoife Brennan BL

--
Claire Hogan
Murphy & Hogan Solicitors
chogan@murphyhogan.ie`;

/**
 * Email-forward ingestion (demo surface). In production each user gets a
 * unique inbound address (e.g. aw-7f3k@in.feenote.ie) and Postmark posts the
 * email here; in demo mode you paste the forwarded email instead. Either
 * way the flow is the same: parse → review → confirm. Target: under 60
 * seconds from forward to confirmed record.
 */
export default function IngestPage() {
  const db = useDb();
  const router = useRouter();
  const [emailText, setEmailText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [draft, setDraft] = useState<ParsedFeeNote | null>(null);
  const [error, setError] = useState("");

  const parse = async () => {
    setParsing(true);
    setError("");
    try {
      const res = await fetch("/api/parse-fee-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailText }),
      });
      if (res.ok) {
        setDraft({ ...(await res.json()), source: "claude" });
        return;
      }
      // No API key / API error → deterministic fallback.
      setDraft(heuristicParse(emailText));
    } catch {
      setDraft(heuristicParse(emailText));
    } finally {
      setParsing(false);
    }
  };

  const confirm = (asDraft: boolean) => {
    if (!draft) return;
    const amountCents = parseAmountToCents(draft.amount);
    if (amountCents === null || amountCents <= 0) {
      setError("Confirm the amount before saving (e.g. 2500.00).");
      return;
    }
    if (!draft.firmName.trim()) {
      setError("Confirm the instructing firm name before saving.");
      return;
    }
    if (!draft.issueDate) {
      setError("Confirm the issue date before saving.");
      return;
    }
    const store = getStore();
    const matterId = store.createMatter({
      firmName: draft.firmName,
      contactName: draft.contactName,
      contactEmail: draft.contactEmail,
      title: draft.matterTitle || "Imported matter",
      reference: draft.matterReference,
    });
    const id = store.createFeeNote({
      matterId,
      amountCents,
      issueDate: draft.issueDate,
      workDescription: draft.workDescription,
      asDraft,
    });
    router.push(`/fee-notes/${id}`);
  };

  const set =
    (k: keyof ParsedFeeNote) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(draft ? { ...draft, [k]: e.target.value } : draft);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Forward a fee note</h1>
        <p className="mt-1 text-sm text-gray-600">
          Paste a fee note email you sent (or a forwarded thread). It&apos;s
          parsed into a draft record — you confirm every field before anything
          is saved.
        </p>
      </div>

      <Card className="space-y-3">
        <textarea
          className={`${inputCls} font-mono text-xs`}
          rows={10}
          placeholder="Paste the forwarded email here…"
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={parse} disabled={parsing || !emailText.trim()}>
            {parsing ? "Parsing…" : "Parse email"}
          </Button>
          <Button variant="ghost" onClick={() => setEmailText(SAMPLE_EMAIL)}>
            Use sample email
          </Button>
        </div>
      </Card>

      {draft && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Review before saving</p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
              {draft.source === "claude" ? "Parsed by Claude" : "Parsed locally (demo mode)"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Instructing firm *">
              <input className={inputCls} value={draft.firmName} onChange={set("firmName")} list="ingest-firms" />
              <datalist id="ingest-firms">
                {db.firms.map((f) => (
                  <option key={f.id} value={f.name} />
                ))}
              </datalist>
            </Field>
            <Field label="Solicitor">
              <input className={inputCls} value={draft.contactName} onChange={set("contactName")} />
            </Field>
            <Field label="Solicitor email">
              <input className={inputCls} value={draft.contactEmail} onChange={set("contactEmail")} />
            </Field>
            <Field label="Matter reference">
              <input className={inputCls} value={draft.matterReference} onChange={set("matterReference")} />
            </Field>
            <Field label="Matter title">
              <input className={inputCls} value={draft.matterTitle} onChange={set("matterTitle")} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount (EUR) *">
                <input className={inputCls} inputMode="decimal" value={draft.amount} onChange={set("amount")} />
              </Field>
              <Field label="Issue date *">
                <input className={inputCls} type="date" value={draft.issueDate} onChange={set("issueDate")} />
              </Field>
            </div>
          </div>
          <Field label="Work description">
            <textarea className={inputCls} rows={2} value={draft.workDescription} onChange={set("workDescription")} />
          </Field>
          {error && <p className="text-sm text-[--color-danger]">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={() => confirm(false)}>Confirm — already issued</Button>
            <Button variant="secondary" onClick={() => confirm(true)}>
              Save as draft
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
