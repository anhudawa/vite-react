import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Subscribe endpoint. Validates the address and returns cleanly.
 * TODO: connect to the list provider (e.g. Buttondown/ConvertKit) — drop the
 * provider call in where noted; the client and UI need no changes.
 */
export async function POST(request: Request) {
  let email = "";
  let requested = ""; // optional: an athlete the reader asked us to verify
  let intent = "subscribe"; // "subscribe" | "request"
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim();
    requested = String(body?.requested ?? "").trim().slice(0, 120);
    intent = String(body?.intent ?? "subscribe").trim().slice(0, 32);
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That address doesn't look right." },
      { status: 422 }
    );
  }

  // TODO: forward { email, intent, requested } to the provider/CRM here. The
  // `requested` field is the lead magnet's gold — a reader telling us exactly
  // which athlete to verify next, with an address to notify when we do.
  void intent;
  void requested;

  return NextResponse.json({ ok: true });
}
