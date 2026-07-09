"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatDate, type ArticleMode, type Pillar } from "@/lib/content";
import { pillarList } from "@/lib/pillars";
import cardStyles from "./ArticleCard.module.css";
import styles from "./EssaysExplorer.module.css";

/**
 * Serializable slice of an essay for the /essays index. Built server-side
 * (href precomputed via `essayHref`) so no Content component ever crosses
 * the server/client boundary.
 */
export interface EssayListItem {
  slug: string;
  title: string;
  dek: string;
  href: string;
  pillar: Pillar | null;
  mode: ArticleMode;
  date: string;
  readingTime: string;
  kicker: string;
}

type PillarFilter = Pillar | "all";
type ModeFilter = Extract<ArticleMode, "feature" | "guide" | "dispatch"> | "all";

const MODE_CHIPS: { value: ModeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "feature", label: "Features" },
  { value: "guide", label: "Guides" },
  { value: "dispatch", label: "Dispatches" },
];

function parsePillar(v: string | null): PillarFilter {
  return pillarList.some((p) => p.slug === v) ? (v as Pillar) : "all";
}

function parseMode(v: string | null): ModeFilter {
  return v === "feature" || v === "guide" || v === "dispatch" ? v : "all";
}

/** The ArticleCard treatment, fed by the serializable item instead of the
 *  full registry entry. Shares ArticleCard.module.css so the two never drift. */
function Card({
  item,
  variant = "row",
  index,
}: {
  item: EssayListItem;
  variant?: "row" | "lead";
  index?: number;
}) {
  return (
    <article className={cardStyles.card} data-variant={variant}>
      <Link href={item.href} className={cardStyles.link}>
        <div className={cardStyles.meta}>
          {typeof index === "number" && (
            <span className={cardStyles.num}>{String(index).padStart(2, "0")}</span>
          )}
          <span className={cardStyles.kicker}>{item.kicker}</span>
          <span className={cardStyles.time}>{item.readingTime}</span>
        </div>
        <h3 className={cardStyles.title}>{item.title}</h3>
        <p className={cardStyles.dek}>{item.dek}</p>
        <div className={cardStyles.foot}>
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span className={cardStyles.read} aria-hidden="true">
            Read →
          </span>
        </div>
      </Link>
    </article>
  );
}

function Chip({
  label,
  pressed,
  onPress,
}: {
  label: string;
  pressed: boolean;
  onPress?: () => void;
}) {
  return (
    <button type="button" className={styles.chip} aria-pressed={pressed} onClick={onPress}>
      {label}
    </button>
  );
}

function ExplorerView({
  items,
  pillar,
  mode,
  onPillar,
  onMode,
}: {
  items: EssayListItem[];
  pillar: PillarFilter;
  mode: ModeFilter;
  onPillar?: (p: PillarFilter) => void;
  onMode?: (m: ModeFilter) => void;
}) {
  const visible = items.filter(
    (e) =>
      (pillar === "all" || e.pillar === pillar) && (mode === "all" || e.mode === mode)
  );
  const [lead, ...rest] = visible;

  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.filters}>
        <div className={styles.filterRow} role="group" aria-label="Filter by pillar">
          <span className={styles.filterLabel}>Pillar</span>
          <Chip label="All" pressed={pillar === "all"} onPress={() => onPillar?.("all")} />
          {pillarList.map((p) => (
            <Chip
              key={p.slug}
              label={p.short}
              pressed={pillar === p.slug}
              onPress={() => onPillar?.(p.slug)}
            />
          ))}
        </div>
        <div className={styles.filterRow} role="group" aria-label="Filter by mode">
          <span className={styles.filterLabel}>Mode</span>
          {MODE_CHIPS.map((m) => (
            <Chip
              key={m.value}
              label={m.label}
              pressed={mode === m.value}
              onPress={() => onMode?.(m.value)}
            />
          ))}
        </div>
        <p className={`${styles.count} tnum`} aria-live="polite">
          {visible.length === items.length
            ? `${items.length} essays`
            : `${visible.length} of ${items.length}`}
        </p>
      </div>

      {lead ? (
        <div className={styles.list}>
          <Card item={lead} variant="lead" />
          <div className={styles.rows}>
            {rest.map((e, i) => (
              <Card key={e.slug} item={e} index={i + 2} />
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.empty}>
          Nothing sits at this crossing yet — widen one of the filters.
        </p>
      )}
    </div>
  );
}

/**
 * Client-side filtering over the statically rendered essay list. Filter state
 * initialises from ?pillar=&mode= (useSearchParams — hence the Suspense
 * boundary in the page) and is written back with history.replaceState so a
 * filtered view is shareable without forcing the route dynamic.
 */
export function EssaysExplorer({ items }: { items: EssayListItem[] }) {
  const searchParams = useSearchParams();
  const [pillar, setPillar] = useState<PillarFilter>(() =>
    parsePillar(searchParams.get("pillar"))
  );
  const [mode, setMode] = useState<ModeFilter>(() => parseMode(searchParams.get("mode")));

  const syncUrl = useCallback((p: PillarFilter, m: ModeFilter) => {
    const url = new URL(window.location.href);
    if (p === "all") url.searchParams.delete("pillar");
    else url.searchParams.set("pillar", p);
    if (m === "all") url.searchParams.delete("mode");
    else url.searchParams.set("mode", m);
    window.history.replaceState(null, "", url);
  }, []);

  const onPillar = (p: PillarFilter) => {
    setPillar(p);
    syncUrl(p, mode);
  };
  const onMode = (m: ModeFilter) => {
    setMode(m);
    syncUrl(pillar, m);
  };

  return (
    <ExplorerView items={items} pillar={pillar} mode={mode} onPillar={onPillar} onMode={onMode} />
  );
}

/**
 * Suspense fallback: the identical view, unfiltered. Because it reads no
 * search params it prerenders — the static HTML ships all 45 essay links and
 * the chip row, and hydration swaps in the interactive explorer in place.
 */
export function EssaysExplorerFallback({ items }: { items: EssayListItem[] }) {
  return <ExplorerView items={items} pillar="all" mode="all" />;
}
