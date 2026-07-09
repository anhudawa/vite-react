"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchDocs, type SearchDoc } from "@/lib/search";
import styles from "./SearchClient.module.css";

/** True when the key event originated in a place where "/" means typing. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function SearchClient({ index }: { index: SearchDoc[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

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

  // "/" focuses the input from anywhere on the page — unless the reader is
  // already typing somewhere.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => searchDocs(index, query), [index, query]);
  const trimmed = query.trim();

  // A new query means a new list: drop the highlight.
  useEffect(() => {
    setActive(-1);
  }, [query]);

  // Keep the active row in view. `block: "nearest"` jumps without animating,
  // so reduced-motion preferences are honored by construction.
  useEffect(() => {
    if (active < 0) return;
    const el = listRef.current?.children[active];
    if (el instanceof HTMLElement) el.scrollIntoView({ block: "nearest" });
  }, [active]);

  const shown = trimmed ? results : [];

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (shown.length > 0) setActive((i) => Math.min(i + 1, shown.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? -1 : i - 1));
    } else if (e.key === "Enter") {
      if (active >= 0 && shown[active]) {
        e.preventDefault();
        router.push(shown[active].href);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setQuery("");
      setActive(-1);
    }
  };

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
          placeholder="athlete, watch, term, idea…"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKeyDown}
          role="combobox"
          aria-expanded={shown.length > 0}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `search-result-${active}` : undefined}
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

      <div className={styles.meta}>
        <p className={styles.count} aria-live="polite">
          {trimmed
            ? `${results.length} ${results.length === 1 ? "result" : "results"}`
            : `${index.length} entries indexed`}
        </p>
        <p className={styles.hint} aria-hidden="true">
          ↑ ↓ move · enter open · esc clear
        </p>
      </div>

      {trimmed && results.length === 0 ? (
        <p className={styles.empty}>
          Nothing yet. The archive is small and deliberately so — try a watch maker, a
          rider, or a single word.
        </p>
      ) : (
        <ul
          ref={listRef}
          id="search-results"
          role="listbox"
          aria-label="Search results"
          className={styles.results}
        >
          {shown.map((doc, i) => (
            <li
              key={`${doc.href} ${doc.title}`}
              id={`search-result-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? `${styles.result} ${styles.resultActive}` : styles.result}
            >
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
