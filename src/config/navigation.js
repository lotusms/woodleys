/**
 * Primary site navigation with keyboard-accessible dropdown menus.
 * @typedef {{ label: string; href: string; description?: string }} NavLink
 * @typedef {{ label: string; href: string; prefix?: boolean; children?: NavLink[]; groups?: { heading?: string; links: NavLink[] }[] }} NavItem
 */

/** Shared desktop nav link / dropdown trigger styles */
export const desktopNavItemClass =
  "inline-flex h-8 shrink-0 items-center gap-1 border-b-2 border-transparent bg-transparent p-0 pb-0.5 text-[0.68rem] font-medium uppercase leading-none tracking-[0.22em] transition-colors";

/** @type {NavItem[]} */
export const mainNav = [
  { label: "Shop All", href: "/shop-all", prefix: true },
  {
    label: "Engagement & Wedding",
    href: "/engagement-wedding",
    prefix: true,
    children: [
      { label: "Solitaire", href: "/engagement-wedding/solitaire" },
      { label: "Halo", href: "/engagement-wedding/halo" },
      { label: "Three-Stone", href: "/engagement-wedding/three-stone" },
      {
        label: "Vintage-Inspired",
        href: "/engagement-wedding/vintage-inspired",
      },
      { label: "Wedding Bands", href: "/engagement-wedding/wedding-bands" },
    ],
  },
  {
    label: "Diamonds",
    href: "/diamonds",
    prefix: true,
    groups: [
      {
        links: [
          { label: "Natural Diamonds", href: "/diamonds/natural-diamonds" },
          {
            label: "Lab-Grown Diamonds",
            href: "/diamonds/lab-grown-diamonds",
          },
        ],
      },
      {
        heading: "Shop by Shape",
        links: [
          { label: "Round", href: "/diamonds/round" },
          { label: "Oval", href: "/diamonds/oval" },
          { label: "Emerald", href: "/diamonds/emerald" },
          { label: "Pear", href: "/diamonds/pear" },
          { label: "Cushion", href: "/diamonds/cushion" },
          { label: "Princess", href: "/diamonds/princess" },
        ],
      },
    ],
  },
  {
    label: "Custom Jewelry",
    href: "/custom-jewelry",
    prefix: true,
    children: [
      { label: "Custom Design", href: "/custom-jewelry/custom-design" },
      {
        label: "Redesign Existing Jewelry",
        href: "/custom-jewelry/redesign",
      },
      { label: "Consultation", href: "/custom-jewelry/consultation" },
    ],
  },
  {
    label: "Fine Jewelry",
    href: "/fine-jewelry",
    prefix: true,
    children: [
      { label: "Rings", href: "/fine-jewelry/rings" },
      { label: "Necklaces", href: "/fine-jewelry/necklaces" },
      { label: "Pendants", href: "/fine-jewelry/pendants" },
      { label: "Earrings", href: "/fine-jewelry/earrings" },
      { label: "Bracelets", href: "/fine-jewelry/bracelets" },
    ],
  },
  {
    label: "Watches",
    href: "/watches",
    prefix: true,
    children: [
      { label: "Bulova", href: "/watches/bulova" },
      { label: "Citizen", href: "/watches/citizen" },
      { label: "Seiko", href: "/watches/seiko" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    prefix: true,
    children: [
      { label: "Jewelry Repairs", href: "/services/jewelry-repairs" },
      { label: "Ring Sizing", href: "/services/ring-sizing" },
      { label: "Rhodium Plating", href: "/services/rhodium-plating" },
      { label: "Jewelry Cleaning", href: "/services/jewelry-cleaning" },
      { label: "Watch Services", href: "/services/watch-services" },
      { label: "Appraisals", href: "/services/appraisals" },
    ],
  },
];

/** Footer-only links removed from the header nav. */
export const footerPageLinks = [
  { label: "About", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

/** Flatten all nav links for mobile menus and sitemaps. */
export function flattenNavLinks(items = mainNav) {
  /** @type {NavLink[]} */
  const links = [];

  for (const item of items) {
    links.push({ label: item.label, href: item.href });

    if (item.children) {
      links.push(...item.children);
    }

    if (item.groups) {
      for (const group of item.groups) {
        links.push(...group.links);
      }
    }
  }

  return links;
}

/** @param {string} pathname */
export function isNavItemActive(pathname, item) {
  if (item.prefix) {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  if (item.href === "/") return pathname === "/";
  return pathname === item.href;
}
