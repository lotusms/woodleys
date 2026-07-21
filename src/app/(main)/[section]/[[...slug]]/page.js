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
import {
  entrySupportsMetalFilter,
  parseMetalParam,
} from "@/config/metals";
import {
  diamondShapeLinksForOrigin,
  parseShapeParam,
} from "@/config/diamond-shapes";

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
 * @param {{ sectionKey?: string; loadAllShapes?: boolean }} [options]
 */
async function loadEntryProducts(entry, options = {}) {
  const { sectionKey, loadAllShapes = false } = options;

  /** @type {string[]} */
  let handles =
    Array.isArray(entry.sourceHandles) && entry.sourceHandles.length > 0
      ? entry.sourceHandles
      : [entry.shopifyHandle];

  /** @type {Map<string, string>} */
  const shapeHandleToSlug = new Map();

  if (
    loadAllShapes &&
    sectionKey === "diamonds" &&
    (entry.slug === "natural-diamonds" || entry.slug === "lab-grown-diamonds")
  ) {
    const shapes = diamondShapeLinksForOrigin(
      /** @type {"natural-diamonds" | "lab-grown-diamonds"} */ (entry.slug),
    );
    handles = shapes.map((shape) => shape.shopifyHandle);
    for (const shape of shapes) {
      shapeHandleToSlug.set(shape.shopifyHandle, shape.slug);
    }
  }

  const batches = await Promise.all(
    handles.map(async (handle) => ({
      handle,
      products: await getCollectionProducts(handle, {
        title: entry.title,
        description: entry.description,
        image: entry.image,
      }),
    })),
  );

  /** @type {import("@/lib/catalog/product-types").CatalogProduct[]} */
  const merged = [];
  const seen = new Set();

  for (const batch of batches) {
    const shapeSlug = shapeHandleToSlug.get(batch.handle);
    for (const product of batch.products) {
      if (seen.has(product.handle)) continue;
      seen.add(product.handle);
      merged.push(
        shapeSlug ? { ...product, catalogShapeSlug: shapeSlug } : product,
      );
    }
  }

  return filterProductsByAudience(merged, entry.audience);
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

export async function generateMetadata({ params, searchParams }) {
  const { section: sectionKey, slug: slugParts } = await params;
  const query = await searchParams;
  const section = assertSection(sectionKey);
  if (!section) return {};
  if (!slugParts?.length) return buildSectionMetadata(section);
  const resolved = resolveCatalogEntry(sectionKey, slugParts);
  if (!resolved) return {};

  const metal = parseMetalParam(
    typeof query?.metal === "string" ? query.metal : undefined,
  );
  const shape = parseShapeParam(
    typeof query?.shape === "string" ? query.shape : undefined,
  );

  const base = buildEntryMetadata(section, resolved.entry);
  if (metal) {
    return {
      ...base,
      title: `${resolved.entry.title} in ${metal.label} | Woodley's Jewelers`,
    };
  }
  if (shape) {
    return {
      ...base,
      title: `${shape.label} ${resolved.entry.title} | Woodley's Jewelers`,
    };
  }
  return base;
}

export default async function CatalogSectionPage({ params, searchParams }) {
  const { section: sectionKey, slug: slugParts } = await params;
  const query = await searchParams;
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

  const metalParam =
    typeof query?.metal === "string" ? query.metal : undefined;
  const shapeParam =
    typeof query?.shape === "string" ? query.shape : undefined;
  const metal = parseMetalParam(metalParam);
  const shape = parseShapeParam(shapeParam);

  const supportsMetal = entrySupportsMetalFilter(
    sectionKey,
    resolved.entry.slug,
  );
  const isDiamondOrigin =
    sectionKey === "diamonds" &&
    (resolved.entry.slug === "natural-diamonds" ||
      resolved.entry.slug === "lab-grown-diamonds");

  const products = isServiceCatalogSection(section)
    ? []
    : await loadEntryProducts(resolved.entry, {
        sectionKey,
        loadAllShapes: isDiamondOrigin,
      });

  return (
    <CategoryDetailPage
      sectionKey={sectionKey}
      section={section}
      entry={resolved.entry}
      ancestors={resolved.ancestors}
      slugPath={resolved.slugPath}
      products={products}
      activeMetalSlug={supportsMetal ? metal?.slug : undefined}
      activeShapeSlug={isDiamondOrigin ? shape?.slug : undefined}
    />
  );
}
