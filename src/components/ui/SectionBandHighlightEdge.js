/**
 * Band highlight — a thin warm-gold catch light like polished ring metal.
 * Overlay-only so it works over gradient backgrounds.
 *
 * @param {{ position?: "top" | "bottom"; className?: string }} props
 */
export default function SectionBandHighlightEdge({
  position = "bottom",
  className = "",
}) {
  const positionClass = position === "top" ? "top-0" : "bottom-0";

  return (
    <div
      className={`pointer-events-none absolute left-1/2 z-20 h-px w-screen max-w-[100vw] -translate-x-1/2 ${positionClass} ${className}`}
      aria-hidden
    >
      <div
        className="band-highlight-edge h-full w-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%)",
        }}
      />
    </div>
  );
}
