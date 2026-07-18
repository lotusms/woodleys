import { notFound, redirect } from "next/navigation";
import {
  getAllCatalogPaths,
  resolveCatalogEntry,
} from "@/lib/catalog/categories";

export async function generateStaticParams() {
  return getAllCatalogPaths().map(({ sectionKey, slugPath }) => ({
    slug: `${sectionKey}-${slugPath.join("-")}`,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const resolved = resolveCatalogEntry(parsed.sectionKey, parsed.slugPath);
  if (!resolved) return {};
  return { title: resolved.entry.title, description: resolved.entry.description };
}

/** @param {string} slug */
function parseSlug(slug) {
  const sectionKeys = [
    "engagement-wedding",
    "custom-jewelry",
    "fine-jewelry",
    "diamonds",
    "watches",
    "services",
    "women",
    "men",
  ];
  for (const sectionKey of sectionKeys) {
    const prefix = `${sectionKey}-`;
    if (!slug.startsWith(prefix)) continue;
    const rest = slug.slice(prefix.length);

    if (sectionKey === "diamonds") {
      if (rest.startsWith("natural-diamonds-")) {
        return {
          sectionKey,
          slugPath: ["natural-diamonds", rest.slice("natural-diamonds-".length)],
        };
      }
      if (rest.startsWith("lab-grown-diamonds-")) {
        return {
          sectionKey,
          slugPath: [
            "lab-grown-diamonds",
            rest.slice("lab-grown-diamonds-".length),
          ],
        };
      }
    }

    if (sectionKey === "watches" && rest.startsWith("vintage-watches-")) {
      return {
        sectionKey,
        slugPath: ["vintage-watches", rest.slice("vintage-watches-".length)],
      };
    }

    return { sectionKey, slugPath: [rest] };
  }
  return null;
}

export default async function LegacyShopSlugPage({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  redirect(`/${parsed.sectionKey}/${parsed.slugPath.join("/")}`);
}
