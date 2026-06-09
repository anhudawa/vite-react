import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

/**
 * Parse a forwarded fee note email with Claude. Structured output keeps the
 * response machine-safe; the client always routes the result through the
 * review screen — nothing AI-extracted is saved without user confirmation.
 *
 * Returns 503 when no ANTHROPIC_API_KEY is configured; the client falls
 * back to the deterministic heuristic parser (demo mode).
 */

const SCHEMA = {
  type: "object" as const,
  properties: {
    firmName: {
      type: "string",
      description: "Instructing solicitor firm name, or empty string if not found",
    },
    contactName: { type: "string", description: "Individual solicitor's name, or empty" },
    contactEmail: { type: "string", description: "Solicitor's email address, or empty" },
    matterTitle: {
      type: "string",
      description: "Case/matter title, e.g. 'O'Brien v Galtee Logistics Ltd', or empty",
    },
    matterReference: { type: "string", description: "Firm's matter/file reference, or empty" },
    amount: {
      type: "string",
      description: "Fee amount in euros as digits with optional decimals, e.g. '2500.00'. Empty if not found.",
    },
    issueDate: {
      type: "string",
      description: "Fee note issue date as yyyy-mm-dd, or empty if not found",
    },
    workDescription: { type: "string", description: "Short summary of the work billed, or empty" },
  },
  required: [
    "firmName",
    "contactName",
    "contactEmail",
    "matterTitle",
    "matterReference",
    "amount",
    "issueDate",
    "workDescription",
  ],
  additionalProperties: false,
};

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Claude parsing not configured; use heuristic fallback" },
      { status: 503 },
    );
  }

  const { emailText } = await req.json();
  if (typeof emailText !== "string" || !emailText.trim()) {
    return NextResponse.json({ error: "emailText is required" }, { status: 400 });
  }

  const client = new Anthropic();
  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      system:
        "You extract structured data from fee note emails sent between Irish barristers and instructing solicitors. " +
        "Extract only what is present — use empty strings for anything not stated. Do not guess. " +
        "Fee amounts are in euros; prefer the figure described as the fee or total. " +
        "Dates use Irish dd/mm/yyyy convention unless clearly ISO format.",
      messages: [{ role: "user", content: emailText.slice(0, 50_000) }],
      output_config: {
        format: { type: "json_schema", schema: SCHEMA },
      },
    });

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      return NextResponse.json({ error: "No output from model" }, { status: 502 });
    }
    return NextResponse.json({ ...JSON.parse(block.text), source: "claude" });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error (${error.status}); use heuristic fallback` },
        { status: 502 },
      );
    }
    throw error;
  }
}
