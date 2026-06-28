/**
 * Stuller catalog embed — sits inside site layout for a unified experience.
 * Set NEXT_PUBLIC_STULLER_EMBED_URL in environment when available.
 */
export default function StullerEmbed() {
  const embedUrl = process.env.NEXT_PUBLIC_STULLER_EMBED_URL;

  if (!embedUrl) {
    return (
      <div className="rounded-sm border border-dashed border-stone-300/80 bg-champagne/40 p-10 text-center">
        <h2 className="font-serif text-xl text-site-fg">Stuller catalog</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-site-secondary">
          The Stuller product catalog will appear here once{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">NEXT_PUBLIC_STULLER_EMBED_URL</code>{" "}
          is configured. Checkout remains through Shopify for a single, consistent
          experience.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-stone-200/80 bg-white shadow-sm">
      <iframe
        title="Stuller jewelry catalog"
        src={embedUrl}
        className="min-h-[70vh] w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
