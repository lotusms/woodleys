/** Storefront form styling — ivory, champagne, warm gold (matches catalog cards). */

export function siteFormShell() {
  return "overflow-hidden rounded-sm border border-stone-200/75 bg-gradient-to-b from-ivory via-white to-champagne/40 p-6 shadow-[0_1px_2px_rgba(41,37,36,0.04),0_18px_40px_rgba(41,37,36,0.08)] ring-1 ring-stone-200/45 sm:p-8 lg:p-9";
}

export function siteFormSuccessShell() {
  return "rounded-sm border border-stone-200/75 bg-gradient-to-b from-ivory via-white to-champagne/35 p-8 shadow-[0_1px_2px_rgba(41,37,36,0.04),0_14px_36px_rgba(41,37,36,0.07)] ring-1 ring-stone-200/45 sm:p-9";
}

export function siteFormEyebrow() {
  return "text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-site-secondary";
}

export function siteFormTitle() {
  return "mt-2 font-serif text-2xl font-medium tracking-[-0.02em] text-site-fg sm:text-[1.65rem]";
}

export function siteFormIntro() {
  return "mt-3 max-w-md text-sm leading-relaxed text-site-secondary";
}

export function siteFormFieldLabel() {
  return "block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary";
}

export function siteFormRequiredMark() {
  return "text-warm-gold-dark";
}

export function siteFormOptionalMark() {
  return "font-normal normal-case tracking-normal text-site-secondary/80";
}

/**
 * @param {boolean} [invalid]
 */
export function siteFormControl(invalid = false) {
  return [
    "mt-2.5 w-full min-h-[3rem] rounded-sm border bg-white/90 px-4 py-3.5 text-sm text-site-fg shadow-[inset_0_1px_2px_rgba(41,37,36,0.04)] transition",
    "placeholder:text-site-secondary/50",
    "border-stone-300/70 hover:border-stone-400/55",
    "focus:border-warm-gold/50 focus:outline-none focus:ring-2 focus:ring-warm-gold/15",
    invalid
      ? "border-rose-400/80 focus:border-rose-500/60 focus:ring-rose-500/15"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function siteFormTextarea() {
  return `${siteFormControl()} min-h-[7.5rem] resize-y leading-relaxed py-3.5`;
}

/**
 * @param {boolean} [invalid]
 */
export function siteFormSelectButton(invalid = false) {
  return [
    "mt-2.5 grid min-h-[3rem] w-full grid-cols-1 rounded-sm border bg-white/90 px-4 py-3.5 text-left text-sm text-site-fg shadow-[inset_0_1px_2px_rgba(41,37,36,0.04)] transition",
    "border-stone-300/70 hover:border-stone-400/55",
    "focus:border-warm-gold/50 focus:outline-none focus:ring-2 focus:ring-warm-gold/15",
    "data-[hover]:border-stone-400/55",
    invalid
      ? "border-rose-400/80 focus:border-rose-500/60 focus:ring-rose-500/15"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function siteFormSelectPanel() {
  return "absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-sm border border-stone-300/80 bg-white py-1 text-sm text-site-fg shadow-lg shadow-stone-900/10 ring-1 ring-stone-200/60 outline-none data-closed:data-leave:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in";
}

export function siteFormSelectOption() {
  return "group relative cursor-default select-none py-2.5 pl-4 pr-10 text-site-fg data-focus:bg-champagne data-focus:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-40";
}

export function siteFormSelectCheck() {
  return "absolute inset-y-0 right-0 flex items-center pr-3 text-warm-gold-dark group-[:not([data-selected])]:hidden";
}

export function siteFormSelectChevron() {
  return "col-start-1 row-start-1 size-4 self-center justify-self-end text-site-secondary";
}

export function siteFormError() {
  return "mt-2 text-xs leading-relaxed text-rose-800";
}

export function siteFormFieldsetLegend() {
  return siteFormFieldLabel();
}

export function siteFormChoiceGrid() {
  return "mt-3 grid gap-2 sm:grid-cols-3";
}

/**
 * @param {boolean} selected
 */
export function siteFormChoiceOption(selected) {
  return [
    "relative flex min-h-[3rem] cursor-pointer items-center justify-center rounded-sm border px-3 py-2.5 text-center text-sm transition",
    selected
      ? "border-warm-gold/45 bg-champagne/75 text-site-fg ring-1 ring-warm-gold/20"
      : "border-stone-300/70 bg-white/85 text-site-secondary hover:border-stone-400/55 hover:bg-ivory",
  ].join(" ");
}

export function siteFormChoiceInput() {
  return "peer sr-only";
}

export function siteFormDivider() {
  return "my-8 h-px w-full bg-stone-200/70";
}
