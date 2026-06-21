import { site } from "./site";

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

/** Anthony Walsh as the bylined author — the E-E-A-T signal the dealer sites lack. */
export function authorPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
    jobTitle: `${site.author.role}, ${site.name}`,
    description: site.author.bio,
    url: `${site.url}/about`,
    image: `${site.url}${site.author.portrait}`,
    sameAs: site.author.sameAs,
    knowsAbout: [
      "Horology",
      "Watchmaking",
      "Watches in sport",
      "Endurance sport",
      "Cycling",
      "Running",
      "Triathlon",
    ],
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  datePublished: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    mainEntityOfPage: `${site.url}${opts.path}`,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: `${site.url}/about`,
      sameAs: site.author.sameAs,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    inLanguage: "en",
  };
}

export function personJsonLd(opts: {
  name: string;
  nationality?: string;
  sameAs?: string[];
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    nationality: opts.nationality,
    sameAs: opts.sameAs,
    url: `${site.url}${opts.path}`,
  };
}

/** The watch itself, as a Product with its maker. No price/offers: an indicative
 *  value is editorial context, not a real offer, so we never emit it as one. */
export function productWatchJsonLd(opts: {
  watch: string;
  brand?: string;
  reference?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.watch,
    category: "Wristwatch",
    ...(opts.brand ? { brand: { "@type": "Brand", name: opts.brand } } : {}),
    ...(opts.reference ? { mpn: opts.reference } : {}),
  };
}

export function brandJsonLd(opts: { name: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: opts.name,
    url: `${site.url}${opts.path}`,
  };
}

export function itemListJsonLd(opts: {
  name: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    url: `${site.url}${opts.path}`,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${site.url}${it.path}`,
    })),
  };
}
