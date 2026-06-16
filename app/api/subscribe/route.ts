import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Subscribe endpoint. Validates the address and returns cleanly.
 * TODO: connect to the list provider (e.g. Buttondown/ConvertKit) — drop the
 * provider call in where noted; the client and UI need no changes.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That address doesn't look right." },
      { status: 422 }
    );
  }

  // TODO: forward `email` to the newsletter provider here.

  return NextResponse.json({ ok: true });
}
