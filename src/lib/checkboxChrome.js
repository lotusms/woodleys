/**
 * Custom checkbox styling — light vs dark (dashboard + storefront forms).
 * @param {boolean} light
 */

/** @param {boolean} light @param {boolean} checked @param {boolean} [disabled] */
export function checkboxBox(light, checked, disabled = false) {
  const unchecked = light
    ? "border-stone-300/90 bg-white text-transparent shadow-sm hover:border-amber-500/50"
    : "border-slate-600/70 bg-slate-950/80 text-transparent shadow-sm hover:border-amber-400/45";

  const checkedStyles = light
    ? "border-amber-600 bg-amber-500 text-white shadow-sm shadow-amber-600/20"
    : "border-amber-400/70 bg-amber-500/90 text-slate-950 shadow-sm shadow-amber-950/30";

  const focus = "peer-focus-visible:border-warm-gold-dark peer-focus-visible:brightness-90";

  const disabledStyles = disabled ? "opacity-50" : "";

  return [
    "flex size-5 shrink-0 items-center justify-center rounded-[0.4rem] border-2 transition duration-150",
    checked ? checkedStyles : unchecked,
    focus,
    disabledStyles,
  ]
    .filter(Boolean)
    .join(" ");
}

/** @param {boolean} light */
export function checkboxLabel(light) {
  return light
    ? "block text-sm font-medium leading-snug text-stone-800"
    : "block text-sm font-medium leading-snug text-stone-100";
}

/** @param {boolean} light */
export function checkboxDescription(light) {
  return light
    ? "mt-0.5 block text-xs leading-relaxed text-stone-500"
    : "mt-0.5 block text-xs leading-relaxed text-slate-400";
}

/** @param {boolean} light @param {boolean} [disabled] */
export function checkboxRow(light, disabled = false) {
  return [
    "inline-flex cursor-pointer items-start gap-3 select-none",
    disabled ? "cursor-not-allowed opacity-60" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** @param {boolean} light @param {boolean} checked @param {boolean} [disabled] */
export function checkboxCard(light, checked, disabled = false) {
  const base =
    "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition duration-150 select-none";

  const state = checked
    ? light
      ? "border-amber-500/55 bg-amber-50/90 ring-1 ring-amber-400/20"
      : "border-amber-400/45 bg-amber-950/25 ring-1 ring-amber-400/15"
    : light
      ? "border-stone-300/70 bg-white hover:border-amber-400/45 hover:bg-amber-50/40"
      : "border-slate-700/50 bg-slate-900/40 hover:border-amber-400/35 hover:bg-slate-900/70";

  const disabledStyles = disabled ? "cursor-not-allowed opacity-50 hover:border-stone-300/70" : "";

  return [base, state, disabledStyles].filter(Boolean).join(" ");
}
