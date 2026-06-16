"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { searchDocs, type SearchDoc } from "@/lib/search";
import styles from "./SearchClient.module.css";

export function SearchClient({ index }: { index: SearchDoc[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Deep-link support without forcing a dynamic route: read ?q= on mount and
  // keep the URL in sync as the reader types.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") ?? "";
    if (q) setQuery(q);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [query]);

  const results = useMemo(() => searchDocs(index, query), [index, query]);
  const trimmed = query.trim();

  return (
    <div className={styles.wrap}>
      <form
        role="search"
        className={styles.form}
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="q" className={styles.srOnly}>
          Search essays and references
        </label>
        <span className={styles.prompt} aria-hidden="true">
          /
        </span>
        <input
          id="q"
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder="athlete, watch, reference, idea…"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            Clear
          </button>
        )}
      </form>

      <p className={styles.count} aria-live="polite">
        {trimmed
          ? `${results.length} ${results.length === 1 ? "result" : "results"}`
          : `${index.length} entries indexed`}
      </p>

      {trimmed && results.length === 0 ? (
        <p className={styles.empty}>
          Nothing yet. The archive is small and deliberately so — try a watch maker, a
          rider, or a single word.
        </p>
      ) : (
        <ul className={styles.results}>
          {(trimmed ? results : []).map((doc) => (
            <li key={doc.href} className={styles.result}>
              <Link href={doc.href} className={styles.link}>
                <span className={styles.kind}>{doc.kind}</span>
                <span className={styles.title}>{doc.title}</span>
                {doc.summary && <span className={styles.summary}>{doc.summary}</span>}
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
