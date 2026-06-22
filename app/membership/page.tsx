import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Membership",
  description: "A members' tier for The Long Second — coming in a later phase.",
  robots: { index: false },
};

// Phase 2 (F.6). The gated archive, members-only essays, and the members'
// shortlist tool attach behind this shell. Hooks left as TODO until the audience
// is proven; nothing gated ships in v1.
// TODO(phase2): wire gated essays/archive + members' shortlist tool here.
export default function Membership() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Membership", path: "/membership" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="Phase two"
        title="Membership"
        intro="A members' tier — the archive, members-only essays, and a one-watch shortlist tool — arrives once the work is deep enough to deserve one. Join the dispatch and you'll hear first."
      />
    </>
  );
}
