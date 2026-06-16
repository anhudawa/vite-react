import { Fraunces, Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";

/**
 * Three voices, never more (per brand brief §7.4).
 *
 * The licensed premium faces specified in the identity (Suisse Int'l / Söhne,
 * GT Sectra / Canela, Monument Mono / GT America Mono) are not available to
 * self-host in this environment. We use the brief's named web fallbacks. This
 * gap is documented in the README.
 *
 *   Grotesque  → Schibsted Grotesk  (workhorse: UI, body, navigation)
 *   Serif      → Fraunces (variable, high-contrast, optical sizing) (the soul)
 *   Mono       → IBM Plex Mono      (specs, references, the Fact Block)
 */

// Variable font — full weight range available via font-weight.
export const grotesque = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesque",
});

// Variable, high-contrast. opsz drives optical sizing; SOFT/WONK add character.
export const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

// Not variable — load the weights we use.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});
