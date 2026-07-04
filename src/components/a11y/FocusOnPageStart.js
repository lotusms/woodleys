"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SITE_LOGO_ID } from "@/components/brand/SiteLogo";

/**
 * Moves keyboard focus to the site logo on first load and after in-app navigation.
 */
export default function FocusOnPageStart() {
  const pathname = usePathname();

  useEffect(() => {
    requestAnimationFrame(() => {
      const logo = document.getElementById(SITE_LOGO_ID);
      logo?.focus({ preventScroll: true });
    });
  }, [pathname]);

  return null;
}
