"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Moves keyboard focus into the main landmark after navigation without scrolling.
 */
export default function FocusOnPageStart() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const main = document.getElementById("main-content");
    main?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
