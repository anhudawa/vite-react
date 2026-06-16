import { Newsreader, Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";

/**
 * Three voices, never more (per the brand identity §07).
 *
 * The licensed premium faces (Suisse Int'l / Söhne, GT Sectra / Canela,
 * Monument Mono / GT America Mono) are not available to self-host here, so we
 * use the design file's named web choices. Documented in the README.
 *
 *   Grotesque  → Schibsted Grotesk  (workhorse: UI, body, navigation)
 *   Serif      → Newsreader (high-contrast, opsz) — the masthead and the voice
 *   Mono       → IBM Plex Mono      (specs, references, the Fact Block)
 */

// Variable font — full weight range available via font-weight.
export const grotesque = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesque",
});

// High-contrast — leads the masthead and the long-form headlines. Static weights
// (not the full variable file) keep the payload light so the headline LCP paints
// fast; an explicit serif fallback covers the swap.
export const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
});

// Not variable — load the weights we use. Mono only sets small labels/specs, so
// keep it off the critical path; the headline serif gets the bandwidth first.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  preload: false,
});
