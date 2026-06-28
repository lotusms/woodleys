"use client";

/**
 * @param {{ light: boolean; className?: string }} props
 */
export default function AuthOrDivider({ light, className = "" }) {
  const line = light ? "border-stone-300/70" : "border-slate-600/50";
  const label = light
    ? "bg-white/92 px-3 text-stone-500"
    : "bg-slate-900/45 px-3 text-slate-400";

  return (
    <div className={`relative my-6 ${className}`.trim()}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className={`w-full border-t ${line}`} />
      </div>
      <div className="relative flex justify-center">
        <span
          className={`text-xs font-medium uppercase tracking-wider ${label}`}
        >
          or
        </span>
      </div>
    </div>
  );
}
