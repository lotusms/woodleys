import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import CategoryGrid from "@/components/catalog/CategoryGrid";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sitePageTitle } from "@/config";

/**
 * @param {{ sectionKey: string; section: import("@/lib/catalog/categories").CATALOG_SECTIONS[string] }} props
 */
export default function CategoryLandingPage({ sectionKey, section }) {
  const items = section.children.map((child) => ({
    title: child.title,
    description: child.description,
    href: `/${sectionKey}/${child.slug}`,
    image: child.image?.src,
    alt: child.image?.alt,
  }));

  return (
    <PageLayout
      eyebrow={section.eyebrow}
      title={section.title}
      subtitle={section.description}
      buttonArea={<PrimaryButton href="/shop-all">Shop All</PrimaryButton>}
    >
      <p>{section.intro}</p>
      <CategoryGrid items={items} />
      <p className="border-l-2 border-warm-gold/30 pl-6 text-sm leading-7 text-site-secondary">
        Prefer guidance in person?{" "}
        <Link
          href="/appointments"
          className="font-medium text-warm-gold-dark underline-offset-4 hover:underline"
        >
          Request a private appointment
        </Link>{" "}
        at our Beaumont showroom.
      </p>
    </PageLayout>
  );
}

export function buildSectionMetadata(section) {
  return {
    title: sitePageTitle(section.title),
    description: section.description,
  };
}
