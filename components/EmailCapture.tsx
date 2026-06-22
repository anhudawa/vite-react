"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import styles from "./EmailCapture.module.css";

export type CaptureVariant = "inline" | "footer" | "popup" | "gate";

export type EmailCaptureProps = {
  /** beehiiv segmentation: where this signup came from. */
  source: string;
  variant?: CaptureVariant;
  /** Headline — content-specific where possible. */
  hook?: string;
  /** One line describing what they get. */
  offer?: string;
  /** Button label. */
  cta?: string;
  /** Quiz segmentation passthrough. */
  sport?: string;
  budget?: string;
  profile?: string;
  /** Fired after a confirmed subscribe (popup/gate use this). */
  onSuccess?: () => void;
};

type State = "idle" | "loading" | "done" | "error";

type Utm = Partial<Record<"source" | "medium" | "campaign" | "term" | "content", string>>;

function readUtm(): { utm: Utm; referringSite?: string } {
  if (typeof window === "undefined") return { utm: {} };
  const p = new URLSearchParams(window.location.search);
  const pick = (k: string) => p.get(`utm_${k}`) || undefined;
  return {
    utm: {
      source: pick("source"),
      medium: pick("medium"),
      campaign: pick("campaign"),
      term: pick("term"),
      content: pick("content"),
    },
    referringSite: document.referrer || undefined,
  };
}

export function EmailCapture({
  source,
  variant = "inline",
  hook = "The watches endurance athletes wear, in your inbox.",
  offer = "The mechanical pieces worn for the life around the sport — the craft, the heritage, who wears what and what it cost. The occasional essay. No hype, unsubscribe in one click.",
  cta = "Subscribe",
  sport,
  budget,
  profile,
  onSuccess,
}: EmailCaptureProps) {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const company = useRef<HTMLInputElement>(null); // honeypot
  const uid = useId();
  const emailId = `${uid}-email`;
  const consentId = `${uid}-consent`;
  const errorId = `${uid}-error`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    if (!consent) {
      setError("Please tick the box to confirm you’re happy to receive email.");
      setState("error");
      return;
    }
    setState("loading");
    setError("");
    const { utm, referringSite } = readUtm();
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent: true,
          source,
          sport,
          budget,
          profile,
          utm,
          referringSite,
          company: company.current?.value ?? "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState("done");
        onSuccess?.();
      } else {
        setError(data.error ?? "Something slipped. Try again.");
        setState("error");
      }
    } catch {
      setError("Something slipped. Try again.");
      setState("error");
    }
  }

  return (
    <div className={styles.root} data-variant={variant}>
      <div className={styles.copy}>
        <p className={styles.kicker}>The dispatch</p>
        <p className={styles.hook}>{hook}</p>
        <p className={styles.offer}>{offer}</p>
      </div>

      {state === "done" ? (
        <p className={styles.confirm} role="status">
          <span className={styles.tick} aria-hidden="true" />
          You’re in. Watch for the first dispatch — check spam if it’s shy.
        </p>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor={emailId} className={styles.srOnly}>
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={styles.input}
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              aria-invalid={state === "error" || undefined}
              aria-describedby={error ? errorId : undefined}
            />
            <button type="submit" className={styles.button} disabled={state === "loading"}>
              {state === "loading" ? "Sending…" : cta}
            </button>
          </div>

          {/* Honeypot — off-screen, not announced, never tabbed to. */}
          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor={`${uid}-company`}>Company</label>
            <input
              id={`${uid}-company`}
              ref={company}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <div className={styles.consentRow}>
            <input
              id={consentId}
              type="checkbox"
              className={styles.checkbox}
              checked={consent}
              onChange={(ev) => setConsent(ev.target.checked)}
            />
            <label htmlFor={consentId} className={styles.consentLabel}>
              I’m happy to get email from The Long Second and agree to the{" "}
              <Link href="/privacy" className={styles.privacyLink}>
                privacy policy
              </Link>
              . Unsubscribe anytime.
            </label>
          </div>

          {error && (
            <p id={errorId} className={styles.error} role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
