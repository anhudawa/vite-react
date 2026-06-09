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
 * Returns null on anything ambiguous rather than guessing.
 */
export function parseAmountToCents(input: string): number | null {
  const cleaned = input.replace(/[€\s,]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(parseFloat(cleaned) * 100);
}
