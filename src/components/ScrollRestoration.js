"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

function shouldPreserveHashScroll() {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash;
  return Boolean(hash && hash !== "#");
}

/** Instant scroll to top — bypasses `scroll-behavior: smooth` on `html`. */
function scrollPageToTop() {
  if (typeof window === "undefined" || shouldPreserveHashScroll()) return;

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * Keeps the viewport at the top on first load and after every in-app navigation.
 * Works with `history.scrollRestoration = "manual"` so the browser does not restore
 * a stale scroll position from the previous page.
 */
export default function ScrollRestoration() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    scrollPageToTop();
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    scrollPageToTop();

    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  return null;
}
