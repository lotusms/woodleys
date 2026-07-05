"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { siteHeaderProgressBarTopClass } from "@/config";

const PHRASES = [
  "Unveiling the piece…",
  "From the showroom floor…",
  "Inspecting the setting…",
  "Opening the vault…",
  "Polishing the details…",
];

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
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState("idle");
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const finishTimerRef = useRef(null);
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const finishTransition = useCallback(() => {
    setPhase((current) => {
      if (current === "idle") return current;
      return "completing";
    });

    if (finishTimerRef.current) {
      window.clearTimeout(finishTimerRef.current);
    }

    finishTimerRef.current = window.setTimeout(() => {
      setPhase("idle");
    }, 480);
  }, []);

  useEffect(() => {
    finishTransition();
    return () => {
      if (finishTimerRef.current) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, [routeKey, finishTransition]);

  useEffect(() => {
    function onPointerDown(event) {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!shouldHandleNavigation(anchor)) return;

      setPhrase(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
      setPhase("running");
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  if (phase === "idle") return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-[120] ${siteHeaderProgressBarTopClass}`}
      role="status"
      aria-live="polite"
      aria-label={phrase}
    >
      <div className="relative h-[3px] w-full overflow-hidden bg-stone-400/20">
        <div className={`route-transition-bar route-transition-bar--${phase}`}>
          <span className="route-transition-spark" aria-hidden />
        </div>
      </div>
      <p className="route-transition-caption">{phrase}</p>
    </div>
  );
}
