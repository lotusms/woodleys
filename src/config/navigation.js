import { diamondShapeLinksForOrigin } from "./diamond-shapes";
import {
  BRIDAL_METAL_SLUGS,
  JEWELRY_METALS,
  metalNavSection,
  metalsBySlug,
} from "./metals";

/**
 * @typedef {{
 *   id: string;
 *   label: string;
 *   href: string;
 *   description?: string;
 *   icon?: { src: string; alt: string };
 *   symbol?: string;
 *   symbolClass?: string;
 *   visuallyHiddenContext?: string;
 *   external?: boolean;
 * }} NavLink
 *
 * @typedef {{
 *   id: string;
 *   heading: string;
 *   headingHref?: string;
 *   layout?: "list" | "iconGrid";
 *   seeAllHref?: string;
 *   seeAllLabel?: string;
 *   links: NavLink[];
 * }} NavSection
 *
 * @typedef {{
 *   id: string;
 *   label: string;
 *   href: string;
 *   prefix?: boolean;
 *   menuType?: "mega" | "compact" | "none";
 *   exploreLabel?: string;
 *   activeMatch?: string[];
 *   sections?: NavSection[];
 *   groups?: NavSection[];
 *   children?: NavLink[];
 *   footerAction?: NavLink;
 * }} NavItem
 */

/** Shared desktop nav link / dropdown trigger styles */
export const desktopNavItemClass =
  "inline-flex items-center gap-1.5 border-b-2 border-transparent px-1 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition focus:outline-none focus-visible:text-warm-gold-dark";

function link(id, label, href, extras = {}) {
  return { id, label, href, ...extras };
}

/**
 * Watches-style shop column: All / Women's / Men's (+ optional extras).
 * @param {{
 *   id: string;
 *   heading: string;
 *   allHref: string;
 *   allLabel: string;
 *   womenHref: string;
 *   womenLabel: string;
 *   menHref: string;
 *   menLabel: string;
 *   extraLinks?: { id: string; label: string; href: string; visuallyHiddenContext?: string }[];
 * }} opts
 */
function shopAudienceSection({
  id,
  heading,
  allHref,
  allLabel,
  womenHref,
  womenLabel,
  menHref,
  menLabel,
  extraLinks = [],
}) {
  return {
    id,
    heading,
    links: [
      link(`${id}-all`, allLabel, allHref),
      link(`${id}-women`, womenLabel, womenHref),
      link(`${id}-men`, menLabel, menHref),
      ...extraLinks,
    ],
  };
}

/** Shop by Shape — natural origin; lab-grown shapes live on the lab-grown landing. */
function shopByShapeSection() {
  const shapes = diamondShapeLinksForOrigin("natural-diamonds");
  return {
    id: "shop-by-shape",
    heading: "Natural by Shape",
    layout: /** @type {"iconGrid"} */ ("iconGrid"),
    links: shapes.map((shape) =>
      link(`shape-${shape.slug}`, shape.label, shape.href, {
        icon: shape.icon,
        visuallyHiddenContext: `Natural diamonds, ${shape.label}`,
      }),
    ),
  };
}

/**
 * Primary site navigation — product discovery with calm mega menus.
 * Gender, style, and brand live inside menus; top level stays scannable.
 *
 * @type {NavItem[]}
 */
export const mainNav = [
  {
    id: "shop",
    label: "Shop",
    href: "/shop-all",
    menuType: "mega",
    exploreLabel: "Shop All Jewelry",
    footerAction: link("shop-footer", "Shop All Jewelry", "/shop-all"),
    sections: [
      {
        id: "shop-jewelry",
        heading: "Shop Jewelry",
        links: [
          link("shop-rings", "Rings", "/fine-jewelry/rings"),
          link("shop-necklaces", "Necklaces", "/fine-jewelry/necklaces"),
          link("shop-earrings", "Earrings", "/fine-jewelry/earrings"),
          link("shop-bracelets", "Bracelets", "/fine-jewelry/bracelets"),
        ],
      },
      {
        id: "shop-recipient",
        heading: "Shop by Recipient",
        links: [
          link("shop-women", "Women", "/women"),
          link("shop-men", "Men", "/men"),
          link("shop-bridal", "Engagement Rings", "/engagement-wedding"),
          link(
            "shop-wedding-bands",
            "Wedding Bands",
            "/engagement-wedding/wedding-bands",
          ),
        ],
      },
    ],
  },
  {
    id: "engagement",
    label: "Engagement",
    href: "/engagement-wedding",
    menuType: "mega",
    exploreLabel: "Explore Engagement Rings",
    activeMatch: [
      "/engagement-wedding/solitaire",
      "/engagement-wedding/halo",
      "/engagement-wedding/three-stone",
      "/engagement-wedding/vintage-inspired",
      "/women/engagement-rings",
      ...metalsBySlug(BRIDAL_METAL_SLUGS).map(
        (metal) => `/engagement-wedding/${metal.slug}`,
      ),
    ],
    footerAction: link(
      "engagement-footer",
      "Explore Engagement Rings",
      "/engagement-wedding",
    ),
    sections: [
      {
        id: "engagement-style",
        heading: "Shop by Style",
        links: [
          link(
            "eng-all",
            "All Engagement Rings",
            "/engagement-wedding",
            { visuallyHiddenContext: "All engagement rings" },
          ),
          link("eng-solitaire", "Solitaire", "/engagement-wedding/solitaire"),
          link("eng-halo", "Halo", "/engagement-wedding/halo"),
          link("eng-three", "Three-Stone", "/engagement-wedding/three-stone"),
          link(
            "eng-vintage",
            "Vintage-Inspired",
            "/engagement-wedding/vintage-inspired",
          ),
        ],
      },
      metalNavSection("/engagement-wedding", "Engagement rings", {
        metals: metalsBySlug(BRIDAL_METAL_SLUGS),
      }),
    ],
  },
  {
    id: "wedding",
    label: "Wedding",
    href: "/engagement-wedding/wedding-bands",
    prefix: true,
    menuType: "mega",
    exploreLabel: "Explore Wedding Bands",
    activeMatch: [
      "/engagement-wedding/wedding-bands",
      "/women/wedding-bands",
      "/men/wedding-bands",
      ...JEWELRY_METALS.map(
        (metal) => `/engagement-wedding/wedding-bands/${metal.slug}`,
      ),
    ],
    footerAction: link(
      "wedding-footer",
      "Explore Wedding Bands",
      "/engagement-wedding/wedding-bands",
    ),
    sections: [
      shopAudienceSection({
        id: "wedding-shop",
        heading: "Shop Wedding Bands",
        allHref: "/engagement-wedding/wedding-bands",
        allLabel: "All Wedding Bands",
        womenHref: "/women/wedding-bands",
        womenLabel: "Women's Wedding Bands",
        menHref: "/men/wedding-bands",
        menLabel: "Men's Wedding Bands",
      }),
      metalNavSection("/engagement-wedding/wedding-bands", "Wedding bands"),
    ],
  },
  {
    id: "rings",
    label: "Rings",
    href: "/fine-jewelry/rings",
    prefix: true,
    menuType: "mega",
    exploreLabel: "Explore Rings",
    activeMatch: [
      "/fine-jewelry/rings",
      "/women/rings",
      "/men/rings",
      ...JEWELRY_METALS.map((metal) => `/fine-jewelry/rings/${metal.slug}`),
    ],
    footerAction: link("rings-footer", "Explore Rings", "/fine-jewelry/rings"),
    sections: [
      shopAudienceSection({
        id: "rings-shop",
        heading: "Shop Rings",
        allHref: "/fine-jewelry/rings",
        allLabel: "All Rings",
        womenHref: "/women/rings",
        womenLabel: "Women's Rings",
        menHref: "/men/rings",
        menLabel: "Men's Rings",
      }),
      metalNavSection("/fine-jewelry/rings", "Rings"),
    ],
  },
  {
    id: "necklaces",
    label: "Necklaces",
    href: "/fine-jewelry/necklaces",
    prefix: true,
    menuType: "mega",
    exploreLabel: "Explore Necklaces",
    activeMatch: [
      "/fine-jewelry/necklaces",
      "/fine-jewelry/pendants",
      "/women/necklaces",
      "/women/pendants",
      "/men/necklaces",
      ...JEWELRY_METALS.map((metal) => `/fine-jewelry/necklaces/${metal.slug}`),
    ],
    footerAction: link(
      "necklaces-footer",
      "Explore Necklaces",
      "/fine-jewelry/necklaces",
    ),
    sections: [
      shopAudienceSection({
        id: "necklaces-shop",
        heading: "Shop Necklaces",
        allHref: "/fine-jewelry/necklaces",
        allLabel: "All Necklaces",
        womenHref: "/women/necklaces",
        womenLabel: "Women's Necklaces",
        menHref: "/men/necklaces",
        menLabel: "Men's Necklaces",
        extraLinks: [
          link("neck-pendants", "Pendants", "/fine-jewelry/pendants"),
        ],
      }),
      metalNavSection("/fine-jewelry/necklaces", "Necklaces"),
    ],
  },
  {
    id: "earrings",
    label: "Earrings",
    href: "/fine-jewelry/earrings",
    prefix: true,
    menuType: "mega",
    exploreLabel: "Explore Earrings",
    activeMatch: [
      "/fine-jewelry/earrings",
      "/women/earrings",
      "/men/earrings",
      ...JEWELRY_METALS.map((metal) => `/fine-jewelry/earrings/${metal.slug}`),
    ],
    footerAction: link(
      "earrings-footer",
      "Explore Earrings",
      "/fine-jewelry/earrings",
    ),
    sections: [
      shopAudienceSection({
        id: "earrings-shop",
        heading: "Shop Earrings",
        allHref: "/fine-jewelry/earrings",
        allLabel: "All Earrings",
        womenHref: "/women/earrings",
        womenLabel: "Women's Earrings",
        menHref: "/men/earrings",
        menLabel: "Men's Earrings",
      }),
      metalNavSection("/fine-jewelry/earrings", "Earrings"),
    ],
  },
  {
    id: "bracelets",
    label: "Bracelets",
    href: "/fine-jewelry/bracelets",
    prefix: true,
    menuType: "mega",
    exploreLabel: "Explore Bracelets",
    activeMatch: [
      "/fine-jewelry/bracelets",
      "/women/bracelets",
      "/men/bracelets",
      ...JEWELRY_METALS.map((metal) => `/fine-jewelry/bracelets/${metal.slug}`),
    ],
    footerAction: link(
      "bracelets-footer",
      "Explore Bracelets",
      "/fine-jewelry/bracelets",
    ),
    sections: [
      shopAudienceSection({
        id: "bracelets-shop",
        heading: "Shop Bracelets",
        allHref: "/fine-jewelry/bracelets",
        allLabel: "All Bracelets",
        womenHref: "/women/bracelets",
        womenLabel: "Women's Bracelets",
        menHref: "/men/bracelets",
        menLabel: "Men's Bracelets",
      }),
      metalNavSection("/fine-jewelry/bracelets", "Bracelets"),
    ],
  },
  {
    id: "watches",
    label: "Watches",
    href: "/watches",
    prefix: true,
    menuType: "mega",
    exploreLabel: "Explore Watches",
    activeMatch: ["/watches", "/women/watches", "/men/watches"],
    footerAction: link("watches-footer", "Explore Watches", "/watches"),
    sections: [
      {
        id: "watches-shop",
        heading: "Shop Watches",
        links: [
          link("w-all", "All Watches", "/watches"),
          link("w-women", "Women's Watches", "/women/watches"),
          link("w-men", "Men's Watches", "/men/watches"),
        ],
      },
      {
        id: "watches-brands",
        heading: "Current Watch Brands",
        links: [
          link("w-bulova", "Bulova", "/watches/bulova"),
          link("w-citizen", "Citizen", "/watches/citizen"),
          link("w-seiko", "Seiko", "/watches/seiko"),
        ],
      },
      {
        id: "watches-vintage",
        heading: "Vintage Watch Brands",
        seeAllHref: "/watches/vintage-watches",
        seeAllLabel: "View all vintage watches",
        links: [
          link("wv-rolex", "Rolex", "/watches/vintage-watches/rolex"),
          link("wv-omega", "Omega", "/watches/vintage-watches/omega"),
          link("wv-movado", "Movado", "/watches/vintage-watches/movado"),
          link("wv-bulova", "Bulova", "/watches/vintage-watches/bulova", {
            visuallyHiddenContext: "Vintage Bulova watches",
          }),
          link("wv-accutron", "Accutron", "/watches/vintage-watches/accutron"),
          link("wv-other", "Other", "/watches/vintage-watches/other", {
            visuallyHiddenContext: "Other vintage watches",
          }),
        ],
      },
    ],
  },
  {
    id: "diamonds",
    label: "Diamonds",
    href: "/diamonds",
    prefix: true,
    menuType: "mega",
    exploreLabel: "Explore Diamonds",
    footerAction: link("diamonds-footer", "Explore Diamonds", "/diamonds"),
    sections: [
      {
        id: "diamonds-shop",
        heading: "Shop Diamonds",
        links: [
          link("d-all", "All Diamonds", "/diamonds"),
          link("d-natural", "Natural Diamonds", "/diamonds/natural-diamonds"),
          link(
            "d-lab",
            "Lab-Grown Diamonds",
            "/diamonds/lab-grown-diamonds",
          ),
        ],
      },
      shopByShapeSection(),
    ],
  },
  {
    id: "custom",
    label: "Custom",
    href: "/custom-jewelry",
    prefix: true,
    menuType: "compact",
    exploreLabel: "Explore Custom Jewelry",
    footerAction: link(
      "custom-footer",
      "Explore Custom Jewelry",
      "/custom-jewelry",
    ),
    sections: [
      {
        id: "custom-services",
        heading: "Custom Jewelry",
        links: [
          link("c-design", "Custom Design", "/custom-jewelry/custom-design"),
          link(
            "c-redesign",
            "Redesign Existing Jewelry",
            "/custom-jewelry/redesign",
          ),
          link(
            "c-consult",
            "Book a Consultation",
            "/custom-jewelry/consultation",
          ),
        ],
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    href: "/services",
    prefix: true,
    menuType: "compact",
    exploreLabel: "Explore Services",
    footerAction: link("services-footer", "Explore Services", "/services"),
    sections: [
      {
        id: "services-jewelry",
        heading: "Jewelry Services",
        links: [
          link("s-repairs", "Jewelry Repairs", "/services/jewelry-repairs"),
          link("s-sizing", "Ring Sizing", "/services/ring-sizing"),
          link("s-rhodium", "Rhodium Plating", "/services/rhodium-plating"),
          link("s-cleaning", "Jewelry Cleaning", "/services/jewelry-cleaning"),
          link("s-appraisals", "Appraisals", "/services/appraisals"),
        ],
      },
      {
        id: "services-watch",
        heading: "Watch Services",
        links: [
          link("s-watch", "Watch Services", "/services/watch-services"),
        ],
      },
    ],
  },
];

/** Normalize sections from sections or legacy groups. */
export function getNavSections(item) {
  if (Array.isArray(item.sections) && item.sections.length > 0) {
    return item.sections;
  }
  if (Array.isArray(item.groups) && item.groups.length > 0) {
    return item.groups;
  }
  if (Array.isArray(item.children) && item.children.length > 0) {
    return [
      {
        id: `${item.id || item.label}-links`,
        heading: item.label,
        links: item.children,
      },
    ];
  }
  return [];
}

/** Footer “Other links” column. */
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
    links.push({
      id: item.id || item.href,
      label: item.label,
      href: item.href,
    });

    for (const section of getNavSections(item)) {
      if (section.seeAllHref) {
        links.push({
          id: `${section.id}-see-all`,
          label: section.seeAllLabel || section.heading,
          href: section.seeAllHref,
        });
      }
      links.push(...section.links);
    }

    if (item.footerAction) {
      links.push(item.footerAction);
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
