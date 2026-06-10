"use client";

import { useState } from "react";
import { getStore, useDb } from "@/lib/store/store";
import { Template } from "@/lib/domain/types";
import { validateTimings } from "@/lib/domain/escalation";
import { downloadJSON } from "@/lib/download";
import { Button, Card, Field, inputCls, PageHeader, SectionTitle } from "@/components/ui";

export default function SettingsPage() {
  const db = useDb();
  return (
    <div className="mx-auto max-w-2xl space-y-1 pb-8">
      <PageHeader title="Settings" />
      {/* Keyed by profile id: the form state initialises during hydration
          from the empty server snapshot; the id change on the client
          snapshot forces a remount with the real values. */}
      <ProfileSection key={`p-${db.profile.id}`} />
      <TimingsSection key={`t-${db.profile.id}`} />
      <SectionTitle>Letter templates</SectionTitle>
      <p className="mb-2 text-xs text-ink-soft">
        Templates are versioned: every chase records the version actually sent,
        so a recovery pack can reproduce exactly what went out. Merge fields:{" "}
        <code className="rounded bg-paper px-1">{"{{fee_note_number}}"}</code>{" "}
        <code className="rounded bg-paper px-1">{"{{outstanding_amount}}"}</code>{" "}
        <code className="rounded bg-paper px-1">{"{{age_days}}"}</code>{" "}
        <code className="rounded bg-paper px-1">{"{{firm_name}}"}</code> etc.
      </p>
      {db.templates.map((t) => (
        <TemplateEditor key={t.id} template={t} />
      ))}
      <DangerZone />
    </div>
  );
}

function ProfileSection() {
  const db = useDb();
  const p = db.profile;
  const [form, setForm] = useState({
    fullName: p.fullName,
    email: p.email,
    lawLibraryNo: p.lawLibraryNo,
    vatNo: p.vatNo,
    address: p.address,
    bankDetails: p.bankDetails,
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <SectionTitle>Profile</SectionTitle>
      <Card className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Full name">
            <input className={inputCls} value={form.fullName} onChange={set("fullName")} />
          </Field>
          <Field label="Email (reply-to on chases)">
            <input className={inputCls} type="email" value={form.email} onChange={set("email")} />
          </Field>
          <Field label="Law Library no.">
            <input className={inputCls} value={form.lawLibraryNo} onChange={set("lawLibraryNo")} />
          </Field>
          <Field label="VAT no.">
            <input className={inputCls} value={form.vatNo} onChange={set("vatNo")} />
          </Field>
        </div>
        <Field label="Address">
          <input className={inputCls} value={form.address} onChange={set("address")} />
        </Field>
        <Field label="Bank details (printed on fee notes)">
          <input className={inputCls} value={form.bankDetails} onChange={set("bankDetails")} />
        </Field>
        <p className="text-xs text-ink-soft">
          In production, changing bank details requires re-authentication with
          2FA — fee note bank details are the number one BEC fraud target in
          Irish legal practice.
        </p>
        <Button onClick={() => getStore().updateProfile(form)}>Save profile</Button>
      </Card>
    </>
  );
}

function TimingsSection() {
  const db = useDb();
  const t = db.profile.timings;
  const [r1, setR1] = useState(String(t.reminder1Days));
  const [r2, setR2] = useState(String(t.reminder2Days));
  const [fl, setFl] = useState(String(t.formalLetterDays));
  const [error, setError] = useState("");

  return (
    <>
      <SectionTitle>Escalation cadence (global default)</SectionTitle>
      <Card className="space-y-3">
        <p className="text-xs text-ink-soft">
          Days after issue for each step. You can soften the cadence on any
          individual fee note; first reminders go out automatically, everything
          beyond that waits for your one-tap approval.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Field label="Reminder 1">
            <input className={inputCls} inputMode="numeric" value={r1} onChange={(e) => setR1(e.target.value)} />
          </Field>
          <Field label="Reminder 2">
            <input className={inputCls} inputMode="numeric" value={r2} onChange={(e) => setR2(e.target.value)} />
          </Field>
          <Field label="Formal letter">
            <input className={inputCls} inputMode="numeric" value={fl} onChange={(e) => setFl(e.target.value)} />
          </Field>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button
          onClick={() => {
            const [a, b, c] = [r1, r2, fl].map((x) => parseInt(x, 10));
            const timings = { reminder1Days: a, reminder2Days: b, formalLetterDays: c };
            const problem = validateTimings(timings);
            if (problem) {
              setError(problem);
              return;
            }
            setError("");
            getStore().updateGlobalTimings(timings);
          }}
        >
          Save cadence
        </Button>
      </Card>
    </>
  );
}

function TemplateEditor({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);

  return (
    <Card className="mb-2">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((s) => !s)}
      >
        <span className="text-sm font-medium">{template.name}</span>
        <span className="text-xs text-ink-soft">
          v{template.version} {open ? "▴" : "▾"}
        </span>
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {template.kind === "SECTION_150" && (
            <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
              Placeholder content — Section 150 wording must be drafted and
              approved by the owner before launch.
            </p>
          )}
          <Field label="Subject">
            <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </Field>
          <Field label="Body">
            <textarea
              className={`${inputCls} font-mono text-xs`}
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Field>
          <Button
            onClick={() => {
              getStore().updateTemplate(template.id, subject, body);
              setOpen(false);
            }}
          >
            Save as v{template.version + 1}
          </Button>
        </div>
      )}
    </Card>
  );
}

function DangerZone() {
  const db = useDb();
  const [confirming, setConfirming] = useState(false);

  const exportAll = () => {
    // GDPR data-portability export (handover §6.4): the complete account
    // dataset, including the append-only audit log, as a single JSON file.
    downloadJSON(`feenote-export-${new Date().toISOString().slice(0, 10)}.json`, db);
  };

  return (
    <>
      <SectionTitle>Data</SectionTitle>
      <Card>
        <p className="text-xs text-ink-soft">
          Demo mode stores everything in this browser. Production uses Supabase
          (EU region) with row-level security; export and deletion work the
          same way there.
        </p>
        <div className="mt-2 flex gap-2">
          <Button variant="secondary" onClick={exportAll}>
            Export all data (JSON)
          </Button>
          {confirming ? (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  getStore().resetAll();
                  setConfirming(false);
                }}
              >
                Yes, erase everything
              </Button>
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setConfirming(true)}>
              Reset all local data
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}
