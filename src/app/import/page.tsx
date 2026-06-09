"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getStore } from "@/lib/store/store";
import { ImportResult, parseFeeNoteImport } from "@/lib/domain/csv";
import { formatCents } from "@/lib/domain/money";
import { formatDate } from "@/lib/domain/dates";
import { Button, Card, inputCls } from "@/components/ui";

const SAMPLE = `firm,solicitor,email,matter,reference,amount,issue date,description
Murphy & Hogan Solicitors,Claire Hogan,chogan@murphyhogan.ie,O'Brien v Galtee Logistics,MH-2241,"2,500.00",14/03/2026,Drafting summons and advice on proofs
Reilly Quinn LLP,Dara Quinn,dquinn@reillyquinn.ie,Re: Estate of M. Donnelly,RQ-887,1800,02/02/2026,Opinion on s.117 application`;

export default function ImportPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result ?? "");
      setText(content);
      setResult(parseFeeNoteImport(content));
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Import your outstanding fees</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bring in your existing book in one go — paste from a spreadsheet or
          upload a CSV. Required columns: <strong>firm</strong>,{" "}
          <strong>amount</strong>, <strong>issue date</strong> (dd/mm/yyyy).
          Optional: solicitor, email, matter, reference, description.
        </p>
      </div>

      <Card className="space-y-3">
        <input
          type="file"
          accept=".csv,text/csv"
          className="text-sm"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <textarea
          className={`${inputCls} font-mono text-xs`}
          rows={8}
          placeholder="Or paste CSV here…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            // Invalidate the preview — importing must always reflect the
            // current text, never an earlier parse.
            setResult(null);
          }}
        />
        <div className="flex gap-2">
          <Button onClick={() => setResult(parseFeeNoteImport(text))}>
            Preview import
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setText(SAMPLE);
              setResult(parseFeeNoteImport(SAMPLE));
            }}
          >
            Use sample data
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="space-y-3">
          {result.errors.length > 0 && (
            <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
              <p className="font-medium">
                {result.errors.length} row(s) need attention (they will be
                skipped):
              </p>
              <ul className="mt-1 list-disc pl-5 text-xs">
                {result.errors.map((e, i) => (
                  <li key={i}>
                    Line {e.line}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.ok.length > 0 && (
            <>
              <p className="text-sm font-medium">
                {result.ok.length} fee note(s) ready to import —{" "}
                {formatCents(result.ok.reduce((s, r) => s + r.amountCents, 0))}{" "}
                total
              </p>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-left text-gray-500">
                      <th className="py-1 pr-2">Firm</th>
                      <th className="py-1 pr-2">Matter</th>
                      <th className="py-1 pr-2">Issued</th>
                      <th className="py-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.ok.map((r, i) => (
                      <tr key={i} className="border-b border-black/5">
                        <td className="py-1 pr-2">{r.firmName}</td>
                        <td className="py-1 pr-2">{r.matterTitle}</td>
                        <td className="py-1 pr-2">{formatDate(r.issueDate)}</td>
                        <td className="py-1 text-right tabular-nums">
                          {formatCents(r.amountCents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={() => {
                  getStore().importFeeNotes(result.ok);
                  router.push("/");
                }}
              >
                Import {result.ok.length} fee note(s)
              </Button>
              <p className="text-xs text-gray-500">
                Imported notes are treated as already issued; the ladder picks
                up from each note&apos;s real age, and anything beyond a first
                reminder still waits for your approval.
              </p>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
