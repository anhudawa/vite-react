"use client";

import { useEffect, useRef } from "react";
import styles from "./CinematicVideo.module.css";

/**
 * A restrained cinematic video: muted, looping, autoplaying only while in view,
 * and only when motion is welcome. The poster is the LCP-safe still; the clip is
 * downloaded (preload="none") and played on intersection, paused off-screen.
 * Under reduced-motion the poster stands alone — a gorgeous frame, not a token.
 */
export function CinematicVideo({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // load + play lazily, once in view
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`${styles.video} ${className}`}
      data-cinematic-video
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
