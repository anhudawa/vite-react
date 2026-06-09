# FeeNote — notes for Claude Code sessions

Barrister fee management & recovery platform (Irish market). Read README.md
for product context; the June 2026 handover spec is the source of truth for
scope. Working title only — naming TBD.

## Commands

- `npm run dev` / `npm run build` / `npm start`
- `npm test` — vitest, domain layer only; keep it green
- `npm run typecheck`

## Architecture rules

- **Domain layer (`src/lib/domain/`) stays pure** — no React, no storage, no
  network. All money is integer cents; dates are ISO strings (UTC for
  date-only values). New business logic goes here with tests.
- **Store (`src/lib/store/`)** is the demo-mode localStorage data layer. It
  mirrors `supabase/migrations/0001_init.sql` 1:1 — change them together.
  Every mutation goes through `mutate()` and writes the audit log.
- **Audit log is append-only.** Never add code that updates or deletes
  entries; recovery packs are generated from it (`buildChronology`).
- **Tailwind v4**: use `@theme`-generated utilities (`bg-brand`,
  `text-danger`, `bg-brand-light`…) defined in `src/app/globals.css`. The
  v3 `bg-[--color-x]` bracket shorthand is NOT supported and fails silently.
- Pages are client components over `useDb()`; `getStore()` only inside
  event handlers (it throws `TransitionError` on blocked transitions —
  catch and surface inline, don't let it crash the handler).

## Product invariants (do not weaken)

1. Nothing beyond a first reminder is ever sent without explicit one-tap
   user approval — enforced in `markStepSent`, keep it there.
2. The user can always pause, skip, or re-cadence a fee note's ladder.
3. Bar referral cap: max 3 active (`BAR_REFERRAL_PACK` state) per user.
4. AI output (email parsing) is draft-only — always passes the review
   screen before saving.
5. Chase tone is impersonal/administrative by design.
6. Per-firm payment stats are computed per user from day one but are never
   surfaced cross-user (Phase 2, gated on legal review).

## Pending / blocked on owner or credentials

- Supabase wiring (schema ready; needs an EU-region project + env vars)
- Outbound email (Postmark/Resend), inbound forwarding addresses
- Stripe billing; server-side PDF generation
- Section 150 template **content** and VAT report treatment — owner
  (a qualified barrister) must approve before launch; both are marked as
  placeholders in the UI.
