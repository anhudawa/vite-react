import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SportGuide } from "@/components/SportGuide";
import { EmailCapture } from "@/components/EmailCapture";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { buyersGuides, getGuide } from "@/data/buyers-guides";
import styles from "./guide.module.css";

export function generateStaticParams() {
  return buyersGuides.map((g) => ({ sport: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}): Promise<Metadata> {
  const { sport } = await params;
  const guide = getGuide(sport);
  if (!guide) return { title: "Buying Guides" };
  return {
    title: `${guide.title} — ${guide.sport} Buying Guide`,
    description: guide.dek,
  };
}

export default async function SportGuidePage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  const guide = getGuide(sport);
  if (!guide) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Buying Guides", path: "/buying-guides" },
          { name: guide.sport, path: `/buying-guides/${guide.slug}` },
        ])}
      />
      <PageHeader
        index="03"
        kicker={`Buy for your sport · ${guide.sport}`}
        title={guide.title}
        intro={guide.dek}
        image={guide.image}
      />
      <SportGuide guide={guide} />

      <div className={`container ${styles.capture}`}>
        <EmailCapture
          variant="gate"
          source={`guide:${guide.slug}`}
          hook="The watch verdicts, for people who measure their lives in seconds."
          offer={`The full ${guide.sport.toLowerCase()} shortlist, the next sports as we publish them, and the bought-vs-paid breakdowns — in your inbox.`}
          cta="Send it to me"
        />
      </div>
    </>
  );
}
