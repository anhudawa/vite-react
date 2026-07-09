import "server-only";

/**
 * Beehiiv API v2 subscription service. Server-only — the API key never reaches
 * the client. Both the quiz and every EmailCapture variant funnel through here.
 *
 * Segmentation rides on `custom_fields` (which MUST already exist in the beehiiv
 * dashboard — new ones are discarded by the API) plus the UTM fields. Tags can't
 * be set on create, so the intended workflow is: create the matching custom
 * fields `source`, `sport`, `budget`, `profile`, then use beehiiv automations to
 * apply tags from those fields. See docs/BEEHIIV.md.
 *
 * Endpoint: POST /v2/publications/{publicationId}/subscriptions
 * Auth:     Authorization: Bearer {BEEHIIV_API_KEY}
 */

const API_BASE = "https://api.beehiiv.com/v2";

export type SubscribeInput = {
  email: string;
  source?: string; // beehiiv segmentation: where the signup came from
  sport?: string; // quiz segmentation
  budget?: string; // quiz segmentation
  profile?: string; // quiz segmentation (the watch profile)
  requested?: string; // optional free-text (e.g. an athlete to cover next)
  utm?: Partial<Record<"source" | "medium" | "campaign" | "term" | "content", string>>;
  referringSite?: string;
};

export type SubscribeResult =
  | { ok: true; status: string; dryRun?: boolean }
  | { ok: false; error: string; code?: number };

function customFields(input: SubscribeInput): { name: string; value: string }[] {
  const fields: { name: string; value: string }[] = [];
  const add = (name: string, value?: string) => {
    const v = value?.trim();
    if (v) fields.push({ name, value: v.slice(0, 200) });
  };
  add("source", input.source);
  add("sport", input.sport);
  add("budget", input.budget);
  add("profile", input.profile);
  add("requested", input.requested);
  return fields;
}

export async function subscribeToBeehiiv(input: SubscribeInput): Promise<SubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  const fields = customFields(input);
  const payload = {
    email: input.email,
    // New subscribers get immediate value via the welcome email / automation.
    send_welcome_email: true,
    // A returning, previously-unsubscribed reader is reactivated rather than erroring.
    reactivate_existing: true,
    utm_source: input.utm?.source || "thelongsecond",
    utm_medium: input.utm?.medium || "owned",
    utm_campaign: input.utm?.campaign || input.source || undefined,
    utm_term: input.utm?.term || undefined,
    utm_content: input.utm?.content || undefined,
    referring_site: input.referringSite || undefined,
    custom_fields: fields.length ? fields : undefined,
  };

  // Not configured (local/preview without secrets). Don't break the UX in dev:
  // log and behave as a dry run so the whole flow stays testable. In production,
  // a missing key is a real error.
  if (!apiKey || !publicationId) {
    if (process.env.NODE_ENV === "production") {
      console.error("[beehiiv] BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID not set");
      return { ok: false, error: "Subscriptions aren’t configured yet." };
    }
    console.warn(`[beehiiv] no credentials — dry-run subscribe for ${payload.email}`);
    return { ok: true, status: "dry-run", dryRun: true };
  }

  try {
    const res = await fetch(`${API_BASE}/publications/${publicationId}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 429) {
      return { ok: false, error: "A lot of people are signing up. Try again in a moment.", code: 429 };
    }

    if (!res.ok) {
      let message = "We couldn’t complete that just now. Please try again.";
      try {
        const body = await res.json();
        const apiMessage = body?.errors?.[0]?.message || body?.message;
        if (typeof apiMessage === "string" && apiMessage.length < 160) message = apiMessage;
      } catch {
        /* keep the friendly default */
      }
      console.error(`[beehiiv] ${res.status} for ${payload.email}: ${message}`);
      return { ok: false, error: message, code: res.status };
    }

    const data = await res.json();
    return { ok: true, status: data?.data?.status ?? "active" };
  } catch (err) {
    console.error("[beehiiv] network error:", err);
    return { ok: false, error: "Something slipped on our end. Try again." };
  }
}
