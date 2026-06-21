# Beehiiv email integration

Both features — the "Find Your Watch" quiz and the sitewide `EmailCapture` — POST
to `/api/subscribe`, which calls `lib/beehiiv.ts` server-side. The API key never
reaches the browser.

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables) and in
`.env.local` for development:

```
BEEHIIV_API_KEY=your-api-v2-key
BEEHIIV_PUBLICATION_ID=pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

If either is missing, subscribe runs in **dry-run** mode in development (logs and
returns success so the UI is testable) and returns a clean error in production.

## Custom fields — create these in beehiiv first

The API **discards** custom fields that don't already exist on the publication.
Create these four (Dashboard → Settings → Custom Fields) so segmentation lands:

| Field    | Example values                                  | Set by |
|----------|-------------------------------------------------|--------|
| `source` | `home`, `footer`, `popup`, `quiz`, `essay:…`, `athlete:…`, `guide:cycling` | every capture |
| `sport`  | `road-cycling`, `running`, `gym-multi`, …       | quiz |
| `budget` | `under-500`, `500-1500`, `1500-5000`, `no-ceiling` | quiz |
| `profile`| `The Sport Mechanical`, `The GPS-First Trainer`, … | quiz |

## Tags

The v2 create-subscription endpoint does **not** accept tags. Apply tags from the
custom fields using beehiiv **Automations** (trigger: subscriber created → if
`source` is `quiz` → add tag `quiz`, etc.). This keeps tagging declarative and
out of the codebase.

## Welcome email

`send_welcome_email: true` is sent on every subscribe so new readers get
immediate value. Configure the welcome email / welcome automation in beehiiv so
there's something worth receiving.

## What gets sent

`lib/beehiiv.ts` posts: `email`, `send_welcome_email`, `reactivate_existing`,
`utm_source/medium/campaign/term/content`, `referring_site`, and `custom_fields`
(`source`, `sport`, `budget`, `profile`, optional `requested`). UTM values are
read from the page URL at submit time; `referring_site` from `document.referrer`.

## Abuse protection

`app/api/subscribe/route.ts` adds a honeypot field (`company`), a best-effort
in-memory per-IP rate limit (6/min), server-side email validation, and requires
explicit, un-pre-ticked consent (`consent: true`).
