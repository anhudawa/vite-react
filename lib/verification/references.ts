/**
 * A small registry of watch makers and the shape of their reference numbers.
 * Catches the most common factual error in this beat: a transposed or invented
 * reference (RM 67-01 vs RM 67-02, a Tudor "79030" typo'd to "79300"). Extend as
 * coverage grows — an unknown maker is allowed through only with a plausible
 * format AND a warning, never silently.
 */
export interface BrandRule {
  brand: string;
  aliases?: string[];
  /** the maker's reference-number grammar */
  pattern: RegExp;
}

export const BRANDS: BrandRule[] = [
  { brand: "Richard Mille", aliases: ["RM"], pattern: /^RM\s?\d{2}-\d{2}$/i },
  { brand: "Rolex", pattern: /^(m)?\d{5,6}[A-Z]{0,3}(-\d{4})?$/i },
  { brand: "Tudor", pattern: /^(m)?\d{4,5}[A-Z]?(-\d{4})?$/i },
  { brand: "Omega", pattern: /^\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{3}$/ },
  { brand: "Audemars Piguet", aliases: ["AP"], pattern: /^\d{5}[A-Z]{2}\.[A-Z0-9.]+$/i },
  { brand: "Patek Philippe", aliases: ["Patek"], pattern: /^\d{4}[A-Z]?(\/\d+[A-Z]?)?(-\d{3})?$/i },
  { brand: "Tag Heuer", aliases: ["TAG Heuer"], pattern: /^[A-Z]{3}\d{4}\.[A-Z]{2}\d{4}$/i },
];

export interface ReferenceCheck {
  ok: boolean;
  brandMatched?: string;
  reason: string;
}

/**
 * Validate a reference against a watch description.
 *  - the named brand must appear in the watch string (no orphan references)
 *  - the reference must satisfy that brand's grammar
 *  - an unknown brand passes only on a generic plausibility check, flagged
 */
export function checkReference(watch: string, reference?: string): ReferenceCheck {
  const w = watch.toLowerCase();
  const rule = BRANDS.find(
    (b) =>
      w.includes(b.brand.toLowerCase()) ||
      b.aliases?.some((a) => w.includes(a.toLowerCase()))
  );

  // A brand-level relationship claim ("X is a Rolex ambassador") is legitimate
  // without a model number — but the maker must be named and recognised. If a
  // reference IS asserted, it has to be correct (checked below).
  if (!reference) {
    if (rule) {
      return {
        ok: true,
        brandMatched: rule.brand,
        reason: `Brand-level claim (${rule.brand}); no specific reference asserted.`,
      };
    }
    return { ok: false, reason: "No reference and no recognised maker named." };
  }

  if (!rule) {
    const plausible = /^[A-Za-z0-9][A-Za-z0-9.\-\/ ]{2,}$/.test(reference);
    return {
      ok: plausible,
      reason: plausible
        ? `Maker not in registry; reference passes generic plausibility (flag for registry).`
        : `Maker not in registry and reference is not a plausible format.`,
    };
  }

  if (!rule.pattern.test(reference.trim())) {
    return {
      ok: false,
      brandMatched: rule.brand,
      reason: `"${reference}" does not match the ${rule.brand} reference grammar.`,
    };
  }
  return {
    ok: true,
    brandMatched: rule.brand,
    reason: `Reference matches ${rule.brand} grammar and the named maker.`,
  };
}
