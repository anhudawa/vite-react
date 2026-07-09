"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Defers mounting (and therefore hydrating) a client component until the
 * reader scrolls near it. Below-fold interactive islands — the footer email
 * capture above all — cost main-thread time on every page if they hydrate at
 * load; behind this wrapper they cost nothing until they're about to be seen.
 * `minHeight` reserves the box so late mounting never shifts layout.
 */
export function LazyMount({
  children,
  minHeight,
  rootMargin = "600px",
}: {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IO support (very old browsers, some crawlers with JS): mount at once.
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
