import { diamondShapeLinksForOrigin } from "./diamond-shapes";

/**
 * Soft mega-menu atmosphere images (decorative only).
 * Prefer local product assets when available.
 */
const navPanelImages = {
  engagement: "/images/hero-engagement.jpg",
  wedding: "/images/products/rings/austin.webp",
  rings: "/images/products/rings/festivity.webp",
  necklaces:
    "https://woodleyjewelers.com/cdn/shop/files/129D2D0B-124A-47E7-9AAD-754D6F1BA1BB_1200x.jpg?v=1639025505",
  earrings:
    "https://woodleyjewelers.com/cdn/shop/files/QE16475--2_1024x1024@2x.jpg?v=1730595415",
  bracelets:
    "https://woodleyjewelers.com/cdn/shop/files/129D2D0B-124A-47E7-9AAD-754D6F1BA1BB_1200x.jpg?v=1639025505",
  watches: "/images/products/watches/bulova.webp",
  diamonds:
    "https://woodleyjewelers.com/cdn/shop/files/FA6CB512-0FF4-43DE-A784-70382EBDA5AD_1200x.jpg?v=1639025505",
  custom:
    "https://woodleyjewelers.com/cdn/shop/files/blowtorch-shaping-ring_800x800@2x.jpg?v=1639027342",
  services:
    "https://woodleyjewelers.com/cdn/shop/files/4DC717D9-AFDD-4A66-90A3-F442E4225EDF_800x800@2x.jpg?v=1639025504",
};

/**
 * Primary site navigation — Kay-style type-first browse.
 * Gender sits inside mega menus (Women's / Men's columns), not as top-level items.
 *
 * @typedef {{
 *   label: string;
 *   href: string;
 *   description?: string;
 *   icon?: { src: string; alt: string };
 * }} NavLink
 * @typedef {{
 *   label: string;
 *   href: string;
 *   prefix?: boolean;
 *   children?: NavLink[];
 *   groups?: {
 *     heading?: string;
 *     layout?: "list" | "iconGrid";
 *     seeAllHref?: string;
 *     links: NavLink[];
 *   }[];
 *   panelWide?: boolean;
 *   exploreLabel?: string;
 *   activeMatch?: string[];
 *   panelImage?: string;
 * }} NavItem
 */

/** Shared desktop nav link / dropdown trigger styles */
export const desktopNavItemClass =
  "inline-flex h-8 shrink-0 items-center gap-1 border-b-2 border-transparent bg-transparent p-0 pb-0.5 text-[0.65rem] font-medium uppercase leading-none tracking-[0.16em] transition-colors";

/** @type {NavItem[]} */
export const mainNav = [
  { label: "Shop All", href: "/shop-all", prefix: true },
  {
    label: "Engagement",
    href: "/engagement-wedding",
    panelWide: true,
    panelImage: navPanelImages.engagement,
    exploreLabel: "Explore Engagement Rings",
    activeMatch: [
      "/engagement-wedding/solitaire",
      "/engagement-wedding/halo",
      "/engagement-wedding/three-stone",
      "/engagement-wedding/vintage-inspired",
      "/women/engagement-rings",
    ],
    groups: [
      {
        heading: "Shop by Style",
        links: [
          { label: "Solitaire", href: "/engagement-wedding/solitaire" },
          { label: "Halo", href: "/engagement-wedding/halo" },
          { label: "Three-Stone", href: "/engagement-wedding/three-stone" },
          {
            label: "Vintage-Inspired",
            href: "/engagement-wedding/vintage-inspired",
          },
          {
            label: "All Engagement Rings",
            href: "/women/engagement-rings",
          },
        ],
      },
      {
        heading: "Diamonds",
        links: [
          { label: "Natural Diamonds", href: "/diamonds/natural-diamonds" },
          {
            label: "Lab-Grown Diamonds",
            href: "/diamonds/lab-grown-diamonds",
          },
          { label: "Shop by Shape", href: "/diamonds" },
        ],
      },
      {
        heading: "Custom",
        links: [
          { label: "Custom Design", href: "/custom-jewelry/custom-design" },
          { label: "Book a Visit", href: "/contact" },
        ],
      },
    ],
  },
  {
    label: "Wedding",
    href: "/engagement-wedding/wedding-bands",
    prefix: true,
    panelWide: true,
    panelImage: navPanelImages.wedding,
    exploreLabel: "Explore Wedding Bands",
    activeMatch: [
      "/engagement-wedding/wedding-bands",
      "/women/wedding-bands",
      "/men/wedding-bands",
    ],
    groups: [
      {
        heading: "Women's",
        links: [
          {
            label: "All Women's Wedding Bands",
            href: "/women/wedding-bands",
          },
          {
            label: "Engagement Rings",
            href: "/women/engagement-rings",
          },
        ],
      },
      {
        heading: "Men's",
        links: [
          {
            label: "All Men's Wedding Bands",
            href: "/men/wedding-bands",
          },
        ],
      },
      {
        heading: "Shop All Bridal",
        links: [
          {
            label: "Engagement & Wedding",
            href: "/engagement-wedding",
          },
          {
            label: "All Wedding Bands",
            href: "/engagement-wedding/wedding-bands",
          },
        ],
      },
    ],
  },
  {
    label: "Rings",
    href: "/fine-jewelry/rings",
    prefix: true,
    panelWide: true,
    panelImage: navPanelImages.rings,
    exploreLabel: "Explore Rings",
    activeMatch: ["/fine-jewelry/rings", "/women/rings", "/men/rings"],
    groups: [
      {
        heading: "Women's",
        links: [
          { label: "All Women's Rings", href: "/women/rings" },
          {
            label: "Engagement Rings",
            href: "/women/engagement-rings",
          },
          { label: "Wedding Bands", href: "/women/wedding-bands" },
        ],
      },
      {
        heading: "Men's",
        links: [
          { label: "All Men's Rings", href: "/men/rings" },
          { label: "Wedding Bands", href: "/men/wedding-bands" },
        ],
      },
    ],
  },
  {
    label: "Necklaces",
    href: "/fine-jewelry/necklaces",
    prefix: true,
    panelWide: true,
    panelImage: navPanelImages.necklaces,
    exploreLabel: "Explore Necklaces",
    activeMatch: [
      "/fine-jewelry/necklaces",
      "/fine-jewelry/pendants",
      "/women/necklaces",
      "/women/pendants",
      "/men/necklaces",
    ],
    groups: [
      {
        heading: "Women's",
        links: [
          { label: "All Women's Necklaces", href: "/women/necklaces" },
          { label: "Pendants", href: "/women/pendants" },
        ],
      },
      {
        heading: "Men's",
        links: [
          { label: "All Men's Necklaces", href: "/men/necklaces" },
        ],
      },
    ],
  },
  {
    label: "Earrings",
    href: "/fine-jewelry/earrings",
    prefix: true,
    panelWide: true,
    panelImage: navPanelImages.earrings,
    exploreLabel: "Explore Earrings",
    activeMatch: [
      "/fine-jewelry/earrings",
      "/women/earrings",
      "/men/earrings",
    ],
    groups: [
      {
        heading: "Women's",
        links: [
          { label: "All Women's Earrings", href: "/women/earrings" },
        ],
      },
      {
        heading: "Men's",
        links: [
          { label: "All Men's Earrings", href: "/men/earrings" },
        ],
      },
    ],
  },
  {
    label: "Bracelets",
    href: "/fine-jewelry/bracelets",
    prefix: true,
    panelWide: true,
    panelImage: navPanelImages.bracelets,
    exploreLabel: "Explore Bracelets",
    activeMatch: [
      "/fine-jewelry/bracelets",
      "/women/bracelets",
      "/men/bracelets",
    ],
    groups: [
      {
        heading: "Women's",
        links: [
          { label: "All Women's Bracelets", href: "/women/bracelets" },
        ],
      },
      {
        heading: "Men's",
        links: [
          { label: "All Men's Bracelets", href: "/men/bracelets" },
        ],
      },
    ],
  },
  {
    label: "Watches",
    href: "/watches",
    prefix: true,
    panelWide: true,
    panelImage: navPanelImages.watches,
    exploreLabel: "Explore Watches",
    activeMatch: ["/watches", "/women/watches", "/men/watches"],
    groups: [
      {
        heading: "Women's",
        links: [
          { label: "All Women's Watches", href: "/women/watches" },
        ],
      },
      {
        heading: "Men's",
        links: [
          { label: "All Men's Watches", href: "/men/watches" },
        ],
      },
      {
        heading: "Shop by Brand",
        links: [
          { label: "Bulova", href: "/watches/bulova" },
          { label: "Citizen", href: "/watches/citizen" },
          { label: "Seiko", href: "/watches/seiko" },
        ],
      },
      {
        heading: "Vintage Watches",
        seeAllHref: "/watches/vintage-watches",
        links: [
          { label: "Rolex", href: "/watches/vintage-watches/rolex" },
          { label: "Omega", href: "/watches/vintage-watches/omega" },
          { label: "Movado", href: "/watches/vintage-watches/movado" },
          { label: "Bulova", href: "/watches/vintage-watches/bulova" },
          { label: "Accutron", href: "/watches/vintage-watches/accutron" },
          { label: "Other", href: "/watches/vintage-watches/other" },
        ],
      },
    ],
  },
  {
    label: "Diamonds",
    href: "/diamonds",
    prefix: true,
    panelWide: true,
    panelImage: navPanelImages.diamonds,
    exploreLabel: "Explore Diamonds",
    groups: [
      {
        heading: "Natural Diamonds",
        layout: "iconGrid",
        seeAllHref: "/diamonds/natural-diamonds",
        links: diamondShapeLinksForOrigin("natural-diamonds").map((shape) => ({
          label: shape.label,
          href: shape.href,
          icon: shape.icon,
        })),
      },
      {
        heading: "Lab-Grown Diamonds",
        layout: "iconGrid",
        seeAllHref: "/diamonds/lab-grown-diamonds",
        links: diamondShapeLinksForOrigin("lab-grown-diamonds").map((shape) => ({
          label: shape.label,
          href: shape.href,
          icon: shape.icon,
        })),
      },
    ],
  },
  {
    label: "Custom",
    href: "/custom-jewelry",
    prefix: true,
    panelImage: navPanelImages.custom,
    exploreLabel: "Explore Custom Jewelry",
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
    label: "Services",
    href: "/services",
    prefix: true,
    panelImage: navPanelImages.services,
    exploreLabel: "Explore Services",
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

/** Footer “Other links” column — About, Contact, FAQs, Testimonials. */
export const footerPageLinks = [
  { label: "About", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Testimonials", href: "/testimonials" },
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
        if (group.seeAllHref && group.heading) {
          links.push({ label: group.heading, href: group.seeAllHref });
        }
        links.push(...group.links);
      }
    }
  }

  return links;
}

/** @param {string} pathname @param {NavItem | { href: string; prefix?: boolean; activeMatch?: string[] }} item */
export function isNavItemActive(pathname, item) {
  if (pathname === item.href) return true;

  if (Array.isArray(item.activeMatch) && item.activeMatch.length > 0) {
    return item.activeMatch.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
  }
  if (item.prefix) {
    return pathname.startsWith(`${item.href}/`);
  }
  return false;
}
