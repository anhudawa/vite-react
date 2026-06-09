-- FeeNote — initial schema (handover §6.2)
--
-- Tenancy model: every table carries user_id and RLS is the primary
-- boundary. The audit_log is append-only: INSERT/SELECT only, no UPDATE or
-- DELETE grants — it is the LSRA evidence base.
--
-- Region note: deploy to a Supabase EU region only (handover §6.4).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  law_library_no text not null default '',
  vat_no text not null default '',
  -- Printed on fee notes. Fraud target (BEC): changes require recent 2FA,
  -- enforced at the application layer.
  bank_details text not null default '',
  address text not null default '',
  reminder1_days int not null default 30 check (reminder1_days > 0),
  reminder2_days int not null default 60 check (reminder2_days > 0),
  formal_letter_days int not null default 90 check (formal_letter_days > 0),
  created_at timestamptz not null default now()
);

create table public.solicitor_firms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  address text not null default '',
  -- Per-user computed payment stats; accretes from day one for the Phase 2
  -- benchmark. Never surfaced cross-user before the legal review gate.
  paid_count int not null default 0,
  total_days_to_pay int not null default 0,
  paid_value_cents bigint not null default 0,
  outstanding_value_cents bigint not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.solicitor_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  firm_id uuid not null references public.solicitor_firms (id) on delete cascade,
  name text not null,
  email text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);

create table public.matters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  firm_id uuid not null references public.solicitor_firms (id),
  contact_id uuid references public.solicitor_contacts (id),
  title text not null,
  reference text not null default '',
  s150_issued_at timestamptz,
  s150_delivery_confirmed_at timestamptz,
  s150_clarifications jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table public.fee_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  matter_id uuid not null references public.matters (id),
  number text not null,
  amount_cents bigint not null check (amount_cents > 0),
  currency text not null default 'EUR',
  issue_date date not null,
  work_description text not null default '',
  state text not null default 'DRAFT' check (state in (
    'DRAFT','ISSUED','REMINDER_1','REMINDER_2','FORMAL_LETTER',
    'RECOVERY_DECISION','BAR_REFERRAL_PACK','LSRA_COMPLAINT_PACK',
    'SETTLED','WRITTEN_OFF','DISPUTED')),
  state_before_dispute text,
  paused boolean not null default false,
  skipped_steps text[] not null default '{}',
  reminder1_days int, -- per-note overrides; null = use profile defaults
  reminder2_days int,
  formal_letter_days int,
  created_at timestamptz not null default now(),
  unique (user_id, number)
);

create table public.escalation_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  fee_note_id uuid not null references public.fee_notes (id) on delete cascade,
  step_type text not null check (step_type in (
    'REMINDER_1','REMINDER_2','FORMAL_LETTER',
    'BAR_REFERRAL_PACK','LSRA_COMPLAINT_PACK')),
  status text not null check (status in ('SCHEDULED','AWAITING_APPROVAL','SENT','SKIPPED')),
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  template_id uuid,
  template_version int,
  user_approved_at timestamptz,
  delivery_meta jsonb,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  fee_note_id uuid not null references public.fee_notes (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  date date not null,
  method text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create table public.payment_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  fee_note_id uuid not null references public.fee_notes (id) on delete cascade,
  instalments jsonb not null default '[]', -- [{due_date, amount_cents}]
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  fee_note_id uuid references public.fee_notes (id) on delete set null,
  matter_id uuid references public.matters (id) on delete set null,
  kind text not null check (kind in (
    'FEE_NOTE_PDF','BAR_REFERRAL_PACK','LSRA_COMPLAINT_PACK',
    'INBOUND_ATTACHMENT','SECTION_150')),
  storage_path text not null, -- Supabase Storage; access via short-expiry signed URLs only
  created_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('REMINDER_1','REMINDER_2','FORMAL_LETTER','SECTION_150')),
  name text not null,
  version int not null default 1,
  subject text not null,
  body text not null,
  updated_at timestamptz not null default now()
);

create table public.correspondence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  fee_note_id uuid not null references public.fee_notes (id) on delete cascade,
  direction text not null check (direction in ('INBOUND','OUTBOUND')),
  at timestamptz not null default now(),
  from_addr text not null default '',
  to_addr text not null default '',
  subject text not null default '',
  body text not null default '',
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  fee_note_id uuid references public.fee_notes (id),
  at timestamptz not null default now(),
  action text not null,
  detail text not null default ''
);

-- ---------------------------------------------------------------------------
-- Row Level Security — the tenancy boundary
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.solicitor_firms enable row level security;
alter table public.solicitor_contacts enable row level security;
alter table public.matters enable row level security;
alter table public.fee_notes enable row level security;
alter table public.escalation_steps enable row level security;
alter table public.payments enable row level security;
alter table public.payment_plans enable row level security;
alter table public.documents enable row level security;
alter table public.templates enable row level security;
alter table public.correspondence enable row level security;
alter table public.audit_log enable row level security;

create policy "own profile" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array[
    'solicitor_firms','solicitor_contacts','matters','fee_notes',
    'escalation_steps','payments','payment_plans','documents',
    'templates','correspondence'
  ] loop
    execute format(
      'create policy "own rows" on public.%I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;

-- Audit log: append-only. Insert + select for the owner; no update/delete
-- policies exist, and grants are revoked outright as a second fence.
create policy "audit insert own" on public.audit_log
  for insert with check (user_id = auth.uid());
create policy "audit read own" on public.audit_log
  for select using (user_id = auth.uid());
revoke update, delete on public.audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Indexes for the hot paths (dashboard, ladder scheduler, packs)
-- ---------------------------------------------------------------------------
create index fee_notes_user_state_idx on public.fee_notes (user_id, state);
create index fee_notes_matter_idx on public.fee_notes (matter_id);
create index escalation_steps_fee_note_idx on public.escalation_steps (fee_note_id);
create index payments_fee_note_idx on public.payments (fee_note_id);
create index correspondence_fee_note_idx on public.correspondence (fee_note_id, at);
create index audit_log_fee_note_idx on public.audit_log (fee_note_id, at);
create index matters_user_firm_idx on public.matters (user_id, firm_id);
