"use client";

import { useId } from "react";

/**
 * Faceted edge — a low repeating zigzag like a diamond crown facet line.
 * Overlay-only so it works over gradient backgrounds.
 *
 * @param {{ position?: "top" | "bottom"; className?: string }} props
 */
export default function SectionFacetedEdge({
  position = "bottom",
  className = "",
}) {
  const uid = useId().replace(/:/g, "");
  const patternId = `faceted-edge-${uid}`;
  const maskId = `faceted-mask-${uid}`;

  const positionClass = position === "top" ? "top-0" : "bottom-0";

  return (
    <div
      className={`pointer-events-none absolute left-1/2 z-20 h-4 w-screen max-w-[100vw] -translate-x-1/2 sm:h-5 ${positionClass} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 16"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <defs>
          <pattern
            id={patternId}
            width="36"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,13 L9,4 L18,13 L27,4 L36,13"
              fill="none"
              stroke="#9a7b4f"
              strokeWidth="1.1"
              strokeOpacity="0.55"
              strokeLinejoin="miter"
            />
            <path
              d="M9,4 L18,13 L27,4"
              fill="none"
              stroke="#c4a574"
              strokeWidth="0.65"
              strokeOpacity="0.35"
            />
            <path
              d="M0,15 L9,11 L18,15 L27,11 L36,15"
              fill="none"
              stroke="#9a7b4f"
              strokeWidth="0.75"
              strokeOpacity="0.28"
              strokeLinejoin="miter"
            />
          </pattern>
          <linearGradient id={`${maskId}-grad`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="6%" stopColor="#fff" stopOpacity="1" />
            <stop offset="94%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={maskId}>
            <rect width="1440" height="16" fill={`url(#${maskId}-grad)`} />
          </mask>
        </defs>
        <rect
          width="1440"
          height="16"
          fill={`url(#${patternId})`}
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
