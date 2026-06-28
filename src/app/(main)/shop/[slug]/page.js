import { notFound, redirect } from "next/navigation";
import { getAllCatalogPaths, getCatalogEntry } from "@/lib/catalog/categories";

export async function generateStaticParams() {
  return getAllCatalogPaths().map(({ sectionKey, slug }) => ({
    slug: `${sectionKey}-${slug}`,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const entry = getCatalogEntry(parsed.sectionKey, parsed.slug);
  if (!entry) return {};
  return { title: entry.title, description: entry.description };
}

/** @param {string} slug */
function parseSlug(slug) {
  const parts = String(slug).split("-");
  const sectionKeys = [
    "engagement-wedding",
    "custom-jewelry",
    "fine-jewelry",
  ];
  for (const sectionKey of sectionKeys) {
    const prefix = `${sectionKey}-`;
    if (slug.startsWith(prefix)) {
      return { sectionKey, slug: slug.slice(prefix.length) };
    }
  }
  if (slug.startsWith("diamonds-")) {
    return { sectionKey: "diamonds", slug: slug.slice("diamonds-".length) };
  }
  if (slug.startsWith("watches-")) {
    return { sectionKey: "watches", slug: slug.slice("watches-".length) };
  }
  if (slug.startsWith("services-")) {
    return { sectionKey: "services", slug: slug.slice("services-".length) };
  }
  return null;
}

export default async function LegacyShopSlugPage({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  redirect(`/${parsed.sectionKey}/${parsed.slug}`);
}
