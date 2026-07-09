import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Shop",
  description: "Owned accessories — coming in a later phase, never standing stock.",
  robots: { index: false },
};

// TRUST FIREWALL (D.6): commerce is ring-fenced from editorial and is NOT built
// in v1. When owned accessories (straps, tools, cases) ship in Phase 2 they live
// on these routes as drops / pre-sells / low-MOQ — never standing inventory, and
// never touching a review's verdict. Do not add affiliate or commercial pressure
// to the editorial side.
// TODO(phase2): drop / pre-sell accessory routes behind the firewall.
export default function Shop() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="Phase two"
        title="Shop"
        intro="No inventory, ever. When there's something worth making — a strap, a tool, kept honest and walled off from the reviews — it'll appear here as a drop, not a warehouse."
      />
    </>
  );
}
