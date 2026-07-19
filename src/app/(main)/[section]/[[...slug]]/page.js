import { notFound } from "next/navigation";
import CategoryLandingPage, {
  buildSectionMetadata,
} from "@/components/catalog/CategoryLandingPage";
import CategoryDetailPage, {
  buildEntryMetadata,
} from "@/components/catalog/CategoryDetailPage";
import {
  getCatalogSection,
  resolveCatalogEntry,
  walkCategoryEntries,
  isServiceCatalogSection,
} from "@/lib/catalog/categories";
import { getCollectionProducts } from "@/lib/catalog/products";
import { filterProductsByAudience } from "@/lib/catalog/product-audience";
import { productMatchesMetal } from "@/config/metals";

export const revalidate = 60;

const SECTION_KEYS = [
  "women",
  "men",
  "engagement-wedding",
  "diamonds",
  "custom-jewelry",
  "fine-jewelry",
  "watches",
  "services",
];

/** @param {string} sectionKey */
function assertSection(sectionKey) {
  if (!SECTION_KEYS.includes(sectionKey)) return null;
  return getCatalogSection(sectionKey);
}

/**
 * @param {import("@/lib/catalog/categories").CategoryEntry} entry
 */
async function loadEntryProducts(entry) {
  const handles =
    Array.isArray(entry.sourceHandles) && entry.sourceHandles.length > 0
      ? entry.sourceHandles
      : [entry.shopifyHandle];

  const batches = await Promise.all(
    handles.map((handle) =>
      getCollectionProducts(handle, {
        title: entry.title,
        description: entry.description,
        image: entry.image,
      }),
    ),
  );

  /** @type {import("@/lib/catalog/product-types").CatalogProduct[]} */
  const merged = [];
  const seen = new Set();

  for (const batch of batches) {
    for (const product of batch) {
      if (seen.has(product.handle)) continue;
      seen.add(product.handle);
      merged.push(product);
    }
  }

  let products = filterProductsByAudience(merged, entry.audience);
  if (entry.metalFilter) {
    products = products.filter((product) =>
      productMatchesMetal(product, entry.metalFilter),
    );
  }
  return products;
}

export async function generateStaticParams() {
  const landing = SECTION_KEYS.map((section) => ({ section }));
  const detail = SECTION_KEYS.flatMap((sectionKey) => {
    const section = getCatalogSection(sectionKey);
    if (!section) return [];
    /** @type {{ section: string; slug: string[] }[]} */
    const paths = [];
    walkCategoryEntries(section.children, (_entry, slugPath) => {
      paths.push({ section: sectionKey, slug: slugPath });
    });
    return paths;
  });
  return [...landing, ...detail];
}

export async function generateMetadata({ params }) {
  const { section: sectionKey, slug: slugParts } = await params;
  const section = assertSection(sectionKey);
  if (!section) return {};
  if (!slugParts?.length) return buildSectionMetadata(section);
  const resolved = resolveCatalogEntry(sectionKey, slugParts);
  if (!resolved) return {};
  return buildEntryMetadata(section, resolved.entry);
}

export default async function CatalogSectionPage({ params }) {
  const { section: sectionKey, slug: slugParts } = await params;
  const section = assertSection(sectionKey);
  if (!section) notFound();

  if (!slugParts?.length) {
    return (
      <CategoryLandingPage
        sectionKey={sectionKey}
        section={section}
      />
    );
  }

  const resolved = resolveCatalogEntry(sectionKey, slugParts);
  if (!resolved) notFound();

  const products = isServiceCatalogSection(section)
    ? []
    : await loadEntryProducts(resolved.entry);

  return (
    <CategoryDetailPage
      sectionKey={sectionKey}
      section={section}
      entry={resolved.entry}
      ancestors={resolved.ancestors}
      slugPath={resolved.slugPath}
      products={products}
    />
  );
}
