import { getImageProps } from "next/image";
import { HOME_HERO_LCP_SLIDE } from "@/lib/home-hero-slides";
import { normalizeCatalogImageSrc } from "@/lib/catalog/normalize-image-src";

/** Preloads the homepage LCP hero image from the document head. */
export default function HomeHeroPreload() {
  const src = normalizeCatalogImageSrc(HOME_HERO_LCP_SLIDE.image);
  const {
    props: { srcSet, sizes, ...imgProps },
  } = getImageProps({
    src,
    alt: HOME_HERO_LCP_SLIDE.imageAlt,
    width: 960,
    height: 1200,
    priority: true,
    sizes: "(max-width: 1024px) 100vw, 42vw",
  });

  return (
    <link
      rel="preload"
      as="image"
      href={imgProps.src}
      imageSrcSet={srcSet}
      imageSizes={sizes}
      fetchPriority="high"
    />
  );
}
