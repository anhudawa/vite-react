"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("esc-theme", next);
    } catch {}
    setTheme(next);
  }

  // The label reads as a spec switch, not a sun/moon cliché.
  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      data-theme-toggle
      aria-label={`Switch to ${isLight ? "dark" : "light"} reading mode`}
      title={`Switch to ${isLight ? "dark" : "light"} reading mode`}
    >
      <span className={styles.track} data-state={theme ?? "dark"}>
        <span className={styles.thumb} />
      </span>
      <span className={styles.read} aria-hidden="true">
        {theme === null ? "··" : isLight ? "BONE" : "BLACK"}
      </span>
    </button>
  );
}
