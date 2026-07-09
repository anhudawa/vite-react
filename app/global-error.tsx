"use client";

/**
 * The last-resort boundary — it replaces the root layout, so it renders its
 * own <html> and <body> and carries every style inline: when the fault
 * reaches this deep, CSS modules and font loading may not survive it.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          background: "#16181b",
          color: "#f2eee6",
          fontFamily:
            'Georgia, "Times New Roman", serif',
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "46ch", padding: "3rem 1.5rem", textAlign: "left" }}>
          <p
            style={{
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#d8f26a",
              margin: "0 0 1rem",
            }}
          >
            Error · Full stop
          </p>
          <h1
            style={{
              fontSize: "2rem",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: "0 0 1rem",
              maxWidth: "16ch",
            }}
          >
            The whole movement stopped.
          </h1>
          <p
            style={{
              color: "#8b9095",
              fontSize: "1.05rem",
              lineHeight: 1.45,
              margin: "0 0 2rem",
            }}
          >
            The fault reached the base plate, beneath the dial and every
            complication, so the mechanism has to restart whole.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "#d8f26a",
                color: "#16181b",
                border: "none",
                borderRadius: "2px",
                padding: "0.75rem 1.25rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8b9095",
                textDecoration: "none",
              }}
            >
              Back to the dial
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
