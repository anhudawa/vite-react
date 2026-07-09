"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EmailCapture } from "./EmailCapture";
import styles from "./EmailPopup.module.css";

const STORAGE_KEY = "tls-popup";
const DISMISS_DAYS = 14; // don't re-show after a dismissal for this long
const SUBSCRIBED_DAYS = 180; // effectively gone once they've joined
const MIN_DWELL_MS = 8000; // never in the first few seconds
const SCROLL_TRIGGER = 0.6; // mobile: 60% of the page

type Cap = { ts: number; action: "dismissed" | "subscribed" };

function suppressed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const cap = JSON.parse(raw) as Cap;
    const days = (Date.now() - cap.ts) / 86_400_000;
    return days < (cap.action === "subscribed" ? SUBSCRIBED_DAYS : DISMISS_DAYS);
  } catch {
    return false;
  }
}

function remember(action: Cap["action"]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), action }));
  } catch {
    /* private mode — fine, it just may show again */
  }
}

export function EmailPopup() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<Element | null>(null);
  const armed = useRef(false); // a trigger has fired this session

  useEffect(() => setMounted(true), []);

  const close = useCallback((action: Cap["action"]) => {
    remember(action);
    setOpen(false);
    // return focus to wherever the reader was
    if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
  }, []);

  // Arm the triggers after hydration + a minimum dwell, once per session.
  useEffect(() => {
    if (!mounted || suppressed()) return;

    let ready = false;
    const dwell = window.setTimeout(() => {
      ready = true;
    }, MIN_DWELL_MS);

    const fire = () => {
      if (!ready || armed.current) return;
      armed.current = true;
      lastFocused.current = document.activeElement;
      setOpen(true);
      cleanup();
    };

    const onMouseOut = (e: MouseEvent) => {
      // exit-intent: pointer leaves through the top of the viewport
      if (e.clientY <= 0 && !e.relatedTarget) fire();
    };
    const onScroll = () => {
      const sc = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (sc >= SCROLL_TRIGGER) fire();
    };

    // Spec: desktop → exit-intent; touch/mobile → ~60% scroll depth.
    const hoverless = window.matchMedia("(hover: none)").matches;
    if (hoverless) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }

    function cleanup() {
      window.clearTimeout(dwell);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, [mounted]);

  // Focus management + ESC + focus trap while open.
  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    if (!node) return;

    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close("dismissed");
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={() => close("dismissed")} data-email-popup>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Subscribe to The Long Second"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          onClick={() => close("dismissed")}
        >
          <span aria-hidden="true">×</span>
        </button>
        <div>
          <EmailCapture
            variant="popup"
            source="popup"
            hook="Don’t leave the wrist behind."
            offer="The watches endurance athletes actually wear — the craft, the heritage, and what it costs — in your inbox. No hype, unsubscribe in one click."
            cta="Join free"
            onSuccess={() => window.setTimeout(() => close("subscribed"), 1400)}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
