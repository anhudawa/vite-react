"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AthleteSearchEntry } from "@/data/athletes";
import styles from "./AthleteLookup.module.css";

function formatGBP(n?: number): string {
  return n ? "~£" + Math.round(n).toLocaleString("en-GB") : "";
}

/**
 * WATCH ID — type an athlete, see what they wear. And where we don't have them
 * yet, the gap becomes the lead magnet: tell us who, leave an address, and we
 * verify them and email you the answer. The thin corpus turns into a request
 * queue with names attached.
 */
export function AthleteLookup({ athletes }: { athletes: AthleteSearchEntry[] }) {
  const [q, setQ] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const query = q.trim();
  const matches = useMemo(() => {
    if (!query) return [];
    const n = query.toLowerCase();
    return athletes.filter((a) => a.name.toLowerCase().includes(n)).slice(0, 6);
  }, [athletes, query]);

  const noMatch = query.length >= 2 && matches.length === 0;

  async function requestVerify(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, requested: query, intent: "request" }),
      });
      const data = await res.json();
      if (res.ok && data.ok) setState("done");
      else {
        setError(data.error ?? "Something slipped. Try again.");
        setState("error");
      }
    } catch {
      setError("Something slipped. Try again.");
      setState("error");
    }
  }

  return (
    <div className={styles.wrap} data-athlete-lookup>
      <label htmlFor="watch-id" className={styles.label}>
        Type an athlete — see what they wear
      </label>
      <div className={styles.field}>
        <span className={styles.prompt} aria-hidden="true">
          ⌕
        </span>
        <input
          id="watch-id"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Pogačar, van der Poel, Pidcock…"
          className={styles.input}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setState("idle");
          }}
        />
      </div>

      {matches.length > 0 && (
        <ul className={styles.results}>
          {matches.map((a) => {
            const row = (
              <>
                <span className={styles.name}>{a.name}</span>
                <span className={styles.watch}>{a.watch}</span>
                <span className={styles.stance} data-stance={a.stance}>
                  {a.stanceLabel}
                </span>
                <span className={styles.value}>{formatGBP(a.valueGBP)}</span>
              </>
            );
            return (
              <li key={a.slug}>
                {a.published ? (
                  <Link href={`/who-wears-what/${a.slug}`} className={styles.result}>
                    {row}
                    <span className={styles.arrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                ) : (
                  <span className={`${styles.result} ${styles.held}`}>
                    {row}
                    <span className={styles.heldTag}>in the workshop</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {noMatch && (
        <div className={styles.lead}>
          {state === "done" ? (
            <p className={styles.confirm} role="status">
              <span className={styles.tick} aria-hidden="true" />
              On it. We&rsquo;ll verify <strong>{query}</strong> and email you what they
              wear — bought or paid for.
            </p>
          ) : (
            <>
              <p className={styles.leadCopy}>
                We haven&rsquo;t verified <strong>{query}</strong> yet. Want us to? Leave
                your email and we&rsquo;ll run it down — the watch, and whether they
                bought it or were paid to wear it — and send you the answer.
              </p>
              <form className={styles.leadForm} onSubmit={requestVerify} noValidate>
                <label htmlFor="watch-id-email" className={styles.srOnly}>
                  Email address
                </label>
                <input
                  id="watch-id-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className={styles.leadInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={state === "error" || undefined}
                />
                <button
                  type="submit"
                  className={styles.leadButton}
                  disabled={state === "loading"}
                >
                  {state === "loading" ? "Sending…" : "Verify them for me"}
                </button>
              </form>
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
