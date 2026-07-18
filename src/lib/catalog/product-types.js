/**
 * Shared catalog product shape for Shopify, local database, and mock listings.
 *
 * @typedef {'shopify' | 'local' | 'mock'} CatalogProductSource
 *
 * @typedef {{
 *   id: string;
 *   title: string;
 *   handle: string;
 *   description: string;
 *   priceUsd: number;
 *   maxPriceUsd: number;
 *   salePriceUsd?: number | null;
 *   image?: { src: string; alt: string };
 *   availableForSale: boolean;
 *   source: CatalogProductSource;
 *   audience?: import("./product-audience").ProductAudience;
 *   createdAt?: string;
 *   popularity?: number;
 * }} CatalogProduct
 *
 * @typedef {CatalogProduct & {
 *   descriptionHtml?: string;
 *   images: { src: string; alt: string }[];
 *   variants: { id: string; title: string; priceUsd: number; availableForSale: boolean }[];
 * }} CatalogProductDetail
 */

export {};
