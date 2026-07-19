import { BULOVA_CATEGORY_IMAGE } from "@/lib/catalog/bulova-sample-products.js";

/** @type {readonly { id: string; image: string; imageAlt: string; heading: string; body: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string; sectionBg: string; sectionGlow: string }[]} */
export const HOME_HERO_SLIDES = [
  {
    id: "engagement",
    image: "/images/heroes/solitaire.png",
    imageAlt:
      "Solitaire engagement rings in yellow gold, white gold, and rose gold with round, oval, and pear diamonds",
    heading: "A ring worthy of the moment you say yes",
    body: `Your engagement ring marks a promise you will carry for a lifetime. We help you choose a setting and stone with patience and care, so the ring you wear feels as meaningful as the marriage it represents.`,
    primaryLabel: "Engagement & Wedding",
    primaryHref: "/engagement-wedding",
    secondaryLabel: "Explore diamonds",
    secondaryHref: "/diamonds",
    sectionBg:
      "bg-[linear-gradient(118deg,#f3e6dc_0%,#f8f1ea_42%,#faf8f4_100%)]",
    sectionGlow:
      "bg-[radial-gradient(ellipse_90%_80%_at_15%_50%,rgba(228,196,168,0.35),transparent_55%)]",
  },
  {
    id: "watches",
    image: BULOVA_CATEGORY_IMAGE.src,
    imageAlt: BULOVA_CATEGORY_IMAGE.alt,
    heading: "Precision you feel on your wrist every day",
    body: `From Bulova classics to sport and dress styles, a fine watch balances craftsmanship with everyday wear. Explore authorized timepieces chosen for reliability, design, and the quiet confidence of a name trusted for generations.`,
    primaryLabel: "Shop watches",
    primaryHref: "/watches",
    secondaryLabel: "View all collections",
    secondaryHref: "/shop-all",
    sectionBg:
      "bg-[linear-gradient(118deg,#e6eaee_0%,#f0eeea_44%,#faf8f4_100%)]",
    sectionGlow:
      "bg-[radial-gradient(ellipse_90%_80%_at_15%_50%,rgba(176,190,204,0.28),transparent_55%)]",
  },
  {
    id: "custom",
    image:
      "https://woodleyjewelers.com/cdn/shop/files/blowtorch-shaping-ring_800x800.jpg?v=1639027342",
    imageAlt: "Jeweler shaping a custom ring at the bench",
    heading: "Jewelry shaped around you alone",
    body: `Some stories deserve a piece that exists nowhere else. Work with our bench jewelers to design jewelry made for your taste, your milestones, and the moments only you can name, from first sketch to finished heirloom.`,
    primaryLabel: "Custom jewelry",
    primaryHref: "/custom-jewelry",
    secondaryLabel: "Book a visit",
    secondaryHref: "/contact",
    sectionBg:
      "bg-[linear-gradient(118deg,#ebe2cf_0%,#f3ecdf_46%,#faf8f4_100%)]",
    sectionGlow:
      "bg-[radial-gradient(ellipse_90%_80%_at_15%_50%,rgba(196,165,116,0.26),transparent_55%)]",
  },
];

export const HOME_HERO_LCP_SLIDE = HOME_HERO_SLIDES[0];
