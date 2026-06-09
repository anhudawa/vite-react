"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getStore, useDb, todayInputValue } from "@/lib/store/store";
import { parseAmountToCents } from "@/lib/domain/money";
import { Button, Card, Field, inputCls } from "@/components/ui";

export default function NewFeeNotePage() {
  const db = useDb();
  const router = useRouter();
  const [firmName, setFirmName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [matterTitle, setMatterTitle] = useState("");
  const [matterRef, setMatterRef] = useState("");
  const [existingMatterId, setExistingMatterId] = useState("");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState(todayInputValue());
  const [work, setWork] = useState("");
  const [issueS150, setIssueS150] = useState(true);
  const [error, setError] = useState("");

  const submit = (asDraft: boolean) => {
    const amountCents = parseAmountToCents(amount);
    if (amountCents === null || amountCents <= 0) {
      setError("Enter a valid amount, e.g. 2500 or 2,500.00");
      return;
    }
    if (!existingMatterId && (!firmName.trim() || !matterTitle.trim())) {
      setError("Pick an existing matter, or give the firm and matter title.");
      return;
    }
    const store = getStore();
    const matterId =
      existingMatterId ||
      store.createMatter({
        firmName,
        contactName,
        contactEmail,
        title: matterTitle,
        reference: matterRef,
      });
    if (!existingMatterId && issueS150) {
      store.issueSection150(matterId);
    }
    const id = store.createFeeNote({
      matterId,
      amountCents,
      issueDate,
      workDescription: work,
      asDraft,
    });
    router.push(`/fee-notes/${id}`);
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-lg font-semibold">New fee note</h1>
      <Card className="space-y-3">
        <Field label="Existing matter (optional)">
          <select
            className={inputCls}
            value={existingMatterId}
            onChange={(e) => setExistingMatterId(e.target.value)}
          >
            <option value="">— New matter —</option>
            {db.matters.map((m) => {
              const firm = db.firms.find((f) => f.id === m.firmId);
              return (
                <option key={m.id} value={m.id}>
                  {m.title} ({firm?.name ?? "?"})
                </option>
              );
            })}
          </select>
        </Field>

        {!existingMatterId && (
          <>
            <Field label="Instructing solicitor firm *">
              <input
                className={inputCls}
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="Murphy & Hogan Solicitors"
                list="firms"
              />
              <datalist id="firms">
                {db.firms.map((f) => (
                  <option key={f.id} value={f.name} />
                ))}
              </datalist>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Solicitor name">
                <input
                  className={inputCls}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </Field>
              <Field label="Solicitor email">
                <input
                  className={inputCls}
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </Field>
            </div>
            <Field label="Matter title *">
              <input
                className={inputCls}
                value={matterTitle}
                onChange={(e) => setMatterTitle(e.target.value)}
                placeholder="O'Brien v Galtee Logistics Ltd"
              />
            </Field>
            <Field label="Matter reference">
              <input
                className={inputCls}
                value={matterRef}
                onChange={(e) => setMatterRef(e.target.value)}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={issueS150}
                onChange={(e) => setIssueS150(e.target.checked)}
              />
              Record a Section 150 notice for this matter now
            </label>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (EUR) *">
            <input
              className={inputCls}
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2,500.00"
            />
          </Field>
          <Field label="Issue date *">
            <input
              className={inputCls}
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Work done">
          <textarea
            className={inputCls}
            rows={3}
            value={work}
            onChange={(e) => setWork(e.target.value)}
            placeholder="Brief fee, Circuit Court hearing…"
          />
        </Field>

        {error && <p className="text-sm text-[--color-danger]">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button onClick={() => submit(false)}>Issue fee note</Button>
          <Button variant="secondary" onClick={() => submit(true)}>
            Save as draft
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Issuing starts the escalation clock: a first reminder is scheduled
          automatically; nothing beyond that ever goes out without your
          approval.
        </p>
      </Card>
    </div>
  );
}
