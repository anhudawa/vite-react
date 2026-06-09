const formatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function formatCents(cents: number): string {
  return formatter.format(cents / 100);
}

/** Compact form for tight mobile layouts: €27.4k, €950. */
export function formatCentsCompact(cents: number): string {
  const euros = cents / 100;
  if (Math.abs(euros) >= 10000) {
    return `€${(euros / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return formatter.format(euros).replace(/\.00$/, "");
}

/**
 * Parse a user-entered amount ("1,250.00", "€1250", "1250") to cents.
 * Returns null on anything ambiguous rather than guessing — in particular
 * comma-decimal input like "1,50" (European €1.50) is rejected rather than
 * silently read as 150.
 */
export function parseAmountToCents(input: string): number | null {
  const trimmed = input.replace(/[€\s]/g, "");
  // Commas are accepted only as thousands separators in groups of three.
  if (!/^(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?$/.test(trimmed)) return null;
  return Math.round(parseFloat(trimmed.replace(/,/g, "")) * 100);
}
