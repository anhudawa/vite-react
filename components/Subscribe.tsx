"use client";

import { useState } from "react";
import styles from "./Subscribe.module.css";

type State = "idle" | "loading" | "done" | "error";

export function Subscribe() {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState("done");
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
    <section className={styles.wrap} aria-labelledby="sub-h">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>The dispatch</p>
          <h2 id="sub-h" className={styles.title}>
            Who bought it, who&rsquo;s paid to wear it — in your inbox.
          </h2>
          <p className={styles.note}>
            Each new athlete we add: the watch, the money, and whether it was bought
            or it&rsquo;s a paid placement. The occasional essay. Nothing else, no hype.
            Unsubscribe in one click.
          </p>
        </div>

        {state === "done" ? (
          <p className={styles.confirm} role="status">
            <span className={styles.tick} aria-hidden="true" />
            Locked in. Watch for the first beat.
          </p>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <label htmlFor="sub-email" className={styles.srOnly}>
              Email address
            </label>
            <input
              id="sub-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={state === "error" || undefined}
              aria-describedby={error ? "sub-error" : undefined}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={state === "loading"}
            >
              {state === "loading" ? "Sending…" : "Subscribe"}
            </button>
            {error && (
              <p id="sub-error" className={styles.error} role="alert">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
