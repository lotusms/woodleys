"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteHeaderProgressBarTopClass } from "@/config";

/** @param {HTMLAnchorElement | null} anchor */
function shouldHandleNavigation(anchor) {
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  if (anchor.dataset.noRouteTransition === "true") return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  let url;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;

  const current = new URL(window.location.href);
  if (url.pathname === current.pathname && url.search === current.search) {
    return false;
  }

  return true;
}

export default function RouteTransitionBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(event) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!shouldHandleNavigation(anchor)) return;

      setVisible(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-[120] ${siteHeaderProgressBarTopClass}`}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="relative h-[2px] w-full overflow-hidden bg-stone-400/15">
        <div className="route-transition-bar route-transition-bar--running" />
      </div>
    </div>
  );
}
