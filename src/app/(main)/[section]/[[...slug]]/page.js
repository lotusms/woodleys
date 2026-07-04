import { notFound } from "next/navigation";
import CategoryLandingPage, {
  buildSectionMetadata,
} from "@/components/catalog/CategoryLandingPage";
import CategoryDetailPage, {
  buildEntryMetadata,
} from "@/components/catalog/CategoryDetailPage";
import { getCatalogSection, getCatalogEntry } from "@/lib/catalog/categories";
import { getCollectionProducts } from "@/lib/catalog/products";

export const revalidate = 60;

const SECTION_KEYS = [
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

export async function generateStaticParams() {
  const landing = SECTION_KEYS.map((section) => ({ section }));
  const detail = SECTION_KEYS.flatMap((sectionKey) => {
    const section = getCatalogSection(sectionKey);
    if (!section) return [];
    return section.children.map((child) => ({
      section: sectionKey,
      slug: [child.slug],
    }));
  });
  return [...landing, ...detail];
}

export async function generateMetadata({ params }) {
  const { section: sectionKey, slug: slugParts } = await params;
  const slug = slugParts?.[0];
  const section = assertSection(sectionKey);
  if (!section) return {};
  if (!slug) return buildSectionMetadata(section);
  const entry = getCatalogEntry(sectionKey, slug);
  if (!entry) return {};
  return buildEntryMetadata(section, entry);
}

export default async function CatalogSectionPage({ params }) {
  const { section: sectionKey, slug: slugParts } = await params;
  const slug = slugParts?.[0];
  const section = assertSection(sectionKey);
  if (!section) notFound();

  if (!slug) {
    return (
      <CategoryLandingPage
        sectionKey={sectionKey}
        section={section}
      />
    );
  }

  const entry = getCatalogEntry(sectionKey, slug);
  if (!entry) notFound();

  const products = await getCollectionProducts(entry.shopifyHandle, {
    title: entry.title,
    description: entry.description,
    image: entry.image,
  });

  return (
    <CategoryDetailPage
      sectionKey={sectionKey}
      section={section}
      entry={entry}
      products={products}
    />
  );
}
