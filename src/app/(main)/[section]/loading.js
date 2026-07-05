import CategoryPageLayout from "@/components/catalog/CategoryPageLayout";

export default function CatalogSectionLoading() {
  return (
    <CategoryPageLayout
      eyebrow="Catalog"
      title="Loading collection"
      subtitle="Gathering pieces from the showroom."
      breadcrumbs={[{ label: "Shop All", href: "/shop-all" }, { label: "…" }]}
    >
      <div className="animate-pulse space-y-8" aria-hidden>
        <div className="h-4 w-full max-w-2xl rounded bg-stone-200/45" />
        <div className="h-4 w-5/6 max-w-xl rounded bg-stone-200/35" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-56 rounded bg-stone-200/45" />
          <div className="h-56 rounded bg-stone-200/45" />
          <div className="h-56 rounded bg-stone-200/45" />
        </div>
      </div>
    </CategoryPageLayout>
  );
}
