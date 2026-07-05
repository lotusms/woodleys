import InnerPageBackdrop from "@/components/InnerPageBackdrop";
import {
  sitePageEdgeMediaAsideInsetClass,
  sitePageEdgeMediaShellClass,
} from "@/config";

const STAGES = [
  "Unveiling the piece",
  "From the showroom floor",
  "Inspecting the setting",
];

function LoadingLine({ className = "" }) {
  return (
    <div
      className={`product-detail-loading-line ${className}`.trim()}
      aria-hidden
    />
  );
}

export default function ProductDetailLoading() {
  const stage = STAGES[Math.floor(Math.random() * STAGES.length)];

  return (
    <div data-page-layout="edge-media" className={sitePageEdgeMediaShellClass}>
      <div className="relative z-10 bg-ivory">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-2 opacity-[0.03] mix-blend-multiply fabric-texture"
        />
        <InnerPageBackdrop />

        <div className="relative z-10 w-full pb-20 lg:pb-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
            <div className="min-w-0">
              <div className="product-detail-loading-gallery relative overflow-hidden bg-champagne px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 lg:pr-12">
                <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
                  <div className="product-detail-loading-sweep" aria-hidden />
                  <div className="product-detail-loading-sparkles" aria-hidden>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-8 sm:p-10">
                    <p className="font-serif text-2xl font-medium tracking-[-0.03em] text-site-fg/85 sm:text-3xl">
                      {stage}
                    </p>
                    <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-site-secondary">
                      Woodley&apos;s Jewelers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`min-w-0 pt-8 sm:pt-10 lg:sticky lg:top-28 lg:self-start ${sitePageEdgeMediaAsideInsetClass}`}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <LoadingLine className="h-3 w-16" />
                <LoadingLine className="h-3 w-24" />
              </div>

              <div className="mt-8 space-y-4">
                <LoadingLine className="h-10 w-[min(100%,18rem)]" />
                <LoadingLine className="h-10 w-[min(100%,14rem)]" />
              </div>

              <div className="mt-8 space-y-3 border-t border-stone-200/70 pt-8">
                <LoadingLine className="h-4 w-28" />
                <LoadingLine className="h-4 w-36" />
                <LoadingLine className="h-4 w-24" />
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <LoadingLine className="h-12 w-full rounded-full sm:max-w-[220px]" />
                <LoadingLine className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
