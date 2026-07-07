import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import {
  EssaysExplorer,
  EssaysExplorerFallback,
  type EssayListItem,
} from "@/components/EssaysExplorer";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { essays } from "@/content/essays/registry";
import { essayHref } from "@/lib/content";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Long-form on athletes and time, across endurance sport — the watch as the one instrument that measures what the body spends. Written by a racer, sourced to the last reference.",
};

export default function EssaysIndex() {
  // Serializable slice only — the Content components stay on the server.
  const items: EssayListItem[] = essays.map((e) => ({
    slug: e.slug,
    title: e.title,
    dek: e.dek,
    href: essayHref(e),
    pillar: e.pillar ?? null,
    mode: e.mode ?? "feature",
    date: e.date,
    readingTime: e.readingTime,
    kicker: e.kicker ?? "Essay",
  }));

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Essays", path: "/essays" },
        ])}
      />
      <PageHeader
        index="04"
        kicker="The reading"
        title="Essays"
        intro="An athlete lives closer to the second than anyone — it is the unit a career is spent in. A watch is the thing built to keep it. These essays sit where the two meet."
      />
      {/* useSearchParams in the explorer needs a Suspense boundary to keep the
          page statically exportable; the fallback is the same list unfiltered,
          so the prerendered HTML still carries every essay link. */}
      <Suspense fallback={<EssaysExplorerFallback items={items} />}>
        <EssaysExplorer items={items} />
      </Suspense>
    </>
  );
}
