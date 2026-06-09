# FeeNote

Fee management and recovery for Irish barristers. **Get paid without being the
one doing the chasing.**

A barrister's unpaid fee notes are a relationship problem, not an invoicing
problem: the solicitor who owes the money is also the source of future work.
FeeNote depersonalises the chase — the system escalates on schedule, the
barrister stays clean.

Built against the June 2026 handover spec. This codebase covers **Milestone 1
(Ledger)**, the core of **Milestone 2 (Engine)**, the ingestion/document side
of **Milestone 3**, and the reports from **Milestone 4**.

## What's implemented

- **Aged debt dashboard** — total outstanding, ageing bands (0–30 → 180+),
  by-firm rollups, and an approval queue. Mobile-first: one thumb, ten
  seconds, full picture.
- **Escalation ladder engine** (`src/lib/domain/escalation.ts`) — the
  per-fee-note state machine: `DRAFT → ISSUED → REMINDER_1 (day 30) →
  REMINDER_2 (day 60) → FORMAL_LETTER (day 90) → RECOVERY_DECISION →
  BAR_REFERRAL_PACK | LSRA_COMPLAINT_PACK → SETTLED | WRITTEN_OFF`, with
  `DISPUTED` as a first-class pausing state. First reminders go out
  automatically on schedule; **everything beyond a first reminder requires
  explicit one-tap user approval** — the product proposes, the barrister
  disposes. Cadence is adjustable globally and per fee note; any note can be
  paused or have steps skipped.
- **Fee note ledger** — create (with optional Section 150 record at matter
  creation), list, filter, detail view with ladder controls, payments
  (partials + payment plans), dispute thread, and full chronology.
- **CSV import** — onboarding for existing aged debt (empty dashboards kill
  activation). Header aliasing, Irish `dd/mm/yyyy` dates, per-row error
  reporting, preview before commit.
- **Recovery packs** — Bar of Ireland referral pack (3-active cap enforced)
  and LSRA complaint pack, generated from the append-only audit log — the
  chronology is the product, never reconstructed. Printable (browser
  print-to-PDF in demo mode).
- **Templates** — versioned, merge-field letter templates; every sent step
  records the template version actually used.
- **Firm payment stats** — days-to-pay computed and stored per firm from day
  one (the Phase 2 benchmark data accretes even before the feature ships),
  surfaced only in defamation-safe bands.
- **Audit log** — append-only record of every state change, send and user
  action; the LSRA evidence base.
- **Email ingestion** — paste/forward a fee note email and it's parsed into a
  draft record via the Claude API (`/api/parse-fee-note`, structured outputs)
  with a deterministic local fallback when no `ANTHROPIC_API_KEY` is set.
  Either way every field passes through a review screen before saving —
  nothing AI-extracted is stored unconfirmed.
- **Documents** — printable fee note (clean template carrying the barrister's
  identity, VAT and bank details) and Section 150 notice rendered from the
  versioned template; matters view tracks s.150 issue/delivery per matter.
- **Reports** — aged debt summary, monthly receipts (cash basis, calendar tax
  year / Form 11 oriented), bi-monthly VAT3 summary (flagged draft pending
  owner sign-off on VAT treatment), with CSV exports.
- **Payment plan monitoring** — missed instalments surface on the dashboard.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # domain-engine unit tests (vitest)
npm run build      # production build
```

The app starts empty (by design — onboarding pushes CSV import first). Use
**"Load the demo practice book"** on the dashboard to seed a realistic junior
counsel book: ~€36k outstanding across six firms, notes at every rung of the
ladder, a quantum dispute, a part-paid note and settled history feeding the
payment stats.

## Architecture

- **Next.js 15 (App Router) + Tailwind 4**, mobile-first responsive web.
- **Domain layer** (`src/lib/domain/`) — pure, storage-agnostic TypeScript:
  state machine, ageing, stats, CSV, template merge, pack assembly. Money is
  integer cents; all of it unit-tested.
- **Demo data layer** (`src/lib/store/`) — localStorage-backed store with
  audit-logged mutations, so the product works end-to-end with no backend.
- **Production schema** (`supabase/migrations/0001_init.sql`) — the full
  Supabase schema from the handover §6.2: every table keyed to `user_id` with
  RLS as the tenancy boundary, and an `audit_log` with **no update/delete
  grants**. The local store mirrors this shape 1:1 so swapping in a Supabase
  adapter is mechanical. Deploy to an EU region only.

### Not yet built (per handover sequencing)

- Supabase Auth + adapter wiring (schema is ready; demo mode unblocks
  evaluation meanwhile)
- Inbound email infrastructure (Postmark routes to unique per-user
  addresses) — the parse → review → confirm pipeline is built; demo mode
  takes a pasted email instead
- Outbound email sending (Postmark/Resend) and per-fee-note reply-to capture
- Server-side PDF generation (printable documents use browser print for now)
  and Stripe billing — Milestone 4
- Section 150 **content** — the engine renders owner-supplied templates; the
  shipped wording is a clearly-marked placeholder pending review by the owner
  (handover §9.1)

## Product principles (tie-breakers)

1. The barrister never looks like the bad guy.
2. Five minutes a week.
3. The chronology is the product.
4. Empty dashboards kill activation.
5. Data accretes from day one.
