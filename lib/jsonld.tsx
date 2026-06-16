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
    knowsAbout: ["Horology", "Watchmaking", "Endurance cycling", "Triathlon"],
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
