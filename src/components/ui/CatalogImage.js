import Image from "next/image";
import { normalizeCatalogImageSrc } from "@/lib/catalog/normalize-image-src";

/**
 * Optimized catalog / marketing image — local public paths and configured remotes.
 *
 * @param {{
 *   src: string;
 *   alt: string;
 *   fill?: boolean;
 *   width?: number;
 *   height?: number;
 *   sizes?: string;
 *   priority?: boolean;
 *   className?: string;
 *   style?: React.CSSProperties;
 * }} props
 */
export default function CatalogImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  className = "",
  style,
}) {
  const optimizedSrc = normalizeCatalogImageSrc(src);

  if (fill) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 1024px) 100vw, 50vw"}
        priority={priority}
        quality={80}
        className={className}
        style={style}
      />
    );
  }

  const resolvedWidth = width ?? 480;
  const resolvedHeight = height ?? 480;

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={resolvedWidth}
      height={resolvedHeight}
      sizes={sizes}
      priority={priority}
      quality={80}
      className={className}
      style={{
        width: "100%",
        height: "auto",
        aspectRatio: `${resolvedWidth} / ${resolvedHeight}`,
        ...style,
      }}
    />
  );
}
