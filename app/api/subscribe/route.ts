import { NextResponse } from "next/server";
import { subscribeToBeehiiv, type SubscribeInput } from "@/lib/beehiiv";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort in-memory rate limit. Per serverless instance, so not a hard
// guarantee — it's a cheap deterrent layered with the honeypot, not a fortress.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || request.headers.get("x-real-ip") || "anon").trim();
}

const clean = (v: unknown, max = 120): string => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot: a hidden field real users never fill. If it's populated, accept
  // silently so the bot believes it succeeded, but do nothing.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many tries. Give it a minute." },
      { status: 429 },
    );
  }

  const email = clean(body.email);
  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That address doesn’t look right." },
      { status: 422 },
    );
  }

  // Consent is mandatory and must be an explicit, un-pre-ticked opt-in.
  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Please tick the box to confirm you’re happy to receive email." },
      { status: 422 },
    );
  }

  const utmRaw = (body.utm ?? {}) as Record<string, unknown>;
  const input: SubscribeInput = {
    email,
    source: clean(body.source, 48) || "site",
    sport: clean(body.sport, 48) || undefined,
    budget: clean(body.budget, 48) || undefined,
    profile: clean(body.profile, 80) || undefined,
    requested: clean(body.requested, 120) || undefined,
    referringSite: clean(body.referringSite, 200) || undefined,
    utm: {
      source: clean(utmRaw.source, 80) || undefined,
      medium: clean(utmRaw.medium, 80) || undefined,
      campaign: clean(utmRaw.campaign, 80) || undefined,
      term: clean(utmRaw.term, 80) || undefined,
      content: clean(utmRaw.content, 80) || undefined,
    },
  };

  const result = await subscribeToBeehiiv(input);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.code ?? 502 });
  }
  return NextResponse.json({ ok: true });
}
