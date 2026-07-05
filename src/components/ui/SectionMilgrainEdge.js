/**
 * Milgrain — a row of tiny beads like classic ring band detail.
 * Overlay-only so it works over gradient backgrounds.
 *
 * @param {{ position?: "top" | "bottom"; className?: string }} props
 */
export default function SectionMilgrainEdge({
  position = "bottom",
  className = "",
}) {
  const positionClass =
    position === "top"
      ? "top-0"
      : "bottom-0";

  return (
    <div
      className={`pointer-events-none absolute left-1/2 z-20 h-3 w-screen max-w-[100vw] -translate-x-1/2 ${positionClass} ${className}`}
      aria-hidden
    >
      <div
        className="milgrain-edge h-full w-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
        }}
      />
    </div>
  );
}
