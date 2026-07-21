"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  dispatchCatalogFilterChange,
  isSamePageCatalogFilter,
  parseCatalogFilterHref,
  replaceCatalogFilterUrl,
} from "@/lib/catalog/catalog-filter";

/**
 * Nav / grid link that applies catalog filters in-place when already on the target page.
 *
 * @param {{
 *   href: string;
 *   children: import("react").ReactNode;
 *   className?: string;
 *   onClick?: (event: import("react").MouseEvent<HTMLAnchorElement>) => void;
 *   close?: () => void;
 *   [key: string]: unknown;
 * }} props
 */
export default function CatalogFilterLink({
  href,
  children,
  onClick,
  close,
  className,
  ...rest
}) {
  const pathname = usePathname();

  function handleClick(event) {
    if (isSamePageCatalogFilter(href, pathname)) {
      event.preventDefault();
      const { metal, shape } = parseCatalogFilterHref(href);
      replaceCatalogFilterUrl(pathname, { metal, shape });
      dispatchCatalogFilterChange({ metal, shape });
      close?.();
      onClick?.(event);
      return;
    }
    close?.();
    onClick?.(event);
  }

  return (
    <Link href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
