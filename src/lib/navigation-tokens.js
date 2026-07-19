/**
 * Navigation layout tokens — keep mega menus consistent across categories.
 */

export const NAV_HOVER_OPEN_MS = 150;
export const NAV_HOVER_CLOSE_MS = 250;
export const NAV_MOTION_MS = 180;

/** Mega menu surface — width follows content, capped to the viewport. */
export const navMegaPanelClass =
  "w-max max-w-[min(72rem,calc(100vw-3rem))] max-h-[calc(100vh-var(--site-header-total-height,8rem)-1.5rem)] overflow-y-auto";

/** Compact dropdown for Custom / Services. */
export const navCompactPanelClass =
  "w-[min(28rem,calc(100vw-2rem))] max-h-[calc(100vh-var(--site-header-total-height,8rem)-1.5rem)] overflow-y-auto";

export const navPanelSurfaceClass =
  "rounded-sm border border-stone-200/80 bg-white shadow-lg shadow-stone-900/8";

export const navSectionHeadingClass =
  "text-[0.65rem] font-semibold uppercase leading-none tracking-[0.22em] text-site-secondary";

export const navLinkClass =
  "block rounded-sm px-1 py-1.5 text-sm text-site-fg transition hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-1";

export const navIconLinkClass =
  "flex w-full flex-col items-center justify-start rounded-sm px-1.5 py-1.5 text-center text-xs font-medium text-site-fg transition hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-1";

/** Shared frame for shape icons and metal symbols in mega-menu icon grids. */
export const navIconTileClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-stone-300/70 bg-champagne/50";

export const navTriggerOpenClass =
  "border-warm-gold bg-champagne/60 text-site-fg";

export const navTriggerCurrentClass = "border-warm-gold text-site-fg";

export const navTriggerIdleClass =
  "text-site-secondary hover:border-stone-300 hover:text-site-fg";

/** Shared pill for Book a Visit + Account in the header utility/actions row. */
export const headerUtilityPillClass =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-stone-300/80 bg-white px-3.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-site-fg transition hover:border-warm-gold hover:bg-champagne focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";
