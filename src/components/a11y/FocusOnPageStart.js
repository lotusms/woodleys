"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { SITE_LOGO_ID } from "@/components/brand/SiteLogo";

/**
 * Moves keyboard focus to the header logo after each navigation without scrolling.
 */
export default function FocusOnPageStart() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const logo = document.getElementById(SITE_LOGO_ID);
    if (logo instanceof HTMLElement) {
      logo.focus({ preventScroll: true });
      return;
    }

    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
