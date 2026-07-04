import { loadSiteIntegrations } from "@/lib/site-integrations";

/**
 * Stuller catalog embed — sits inside site layout for a unified experience.
 * URL is configured in Dashboard → Settings (stored in Firestore) or via env fallback.
 */
export default async function StullerEmbed() {
  const integrations = await loadSiteIntegrations();
  const embedUrl = integrations.stullerEmbedUrl;

  if (!embedUrl) {
    return (
      <div className="rounded-sm border border-dashed border-stone-300/80 bg-champagne/40 p-10 text-center">
        <h2 className="font-serif text-xl text-site-fg">Stuller catalog</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-site-secondary">
          Add your Stuller showcase embed URL in{" "}
          <strong className="font-medium text-site-fg">Dashboard → Settings</strong>{" "}
          to display the extended catalog here on Shop All.
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
