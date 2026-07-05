"use client";

import { useState } from "react";

/**
 * @param {{
 *   description?: string;
 *   descriptionHtml?: string;
 *   specs?: { label: string; value: string }[];
 * }} props
 */
export default function ProductDetailTabs({
  description = "",
  descriptionHtml,
  specs = [],
}) {
  const hasSpecs = Array.isArray(specs) && specs.length > 0;
  const tabs = [
    { id: "description", label: "Description" },
    ...(hasSpecs ? [{ id: "details", label: "Details" }] : []),
    { id: "care", label: "Care" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="mt-8 border-t border-stone-200/70 pt-6">
      <div
        className="flex flex-wrap gap-x-6 gap-y-2"
        role="tablist"
        aria-label="Product information"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`product-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`product-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 ${
                selected
                  ? "border-b border-site-fg text-site-fg"
                  : "border-b border-transparent text-site-secondary hover:text-site-fg"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[6rem]">
        {activeTab === "description" ? (
          <div
            id="product-panel-description"
            role="tabpanel"
            aria-labelledby="product-tab-description"
            className="text-sm leading-7 text-site-secondary sm:text-[0.9375rem] sm:leading-8"
          >
            {descriptionHtml ? (
              <div
                className="prose prose-stone max-w-none prose-p:my-0 prose-headings:font-serif prose-headings:text-site-fg"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              <p>{description}</p>
            )}
          </div>
        ) : null}

        {activeTab === "details" && hasSpecs ? (
          <dl
            id="product-panel-details"
            role="tabpanel"
            aria-labelledby="product-tab-details"
            className="space-y-3"
          >
            {specs.map((spec) => (
              <div
                key={`${spec.label}-${spec.value}`}
                className="grid gap-1 sm:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-site-secondary">
                  {spec.label}
                </dt>
                <dd className="text-sm leading-relaxed text-site-fg">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {activeTab === "care" ? (
          <div
            id="product-panel-care"
            role="tabpanel"
            aria-labelledby="product-tab-care"
            className="space-y-4 text-sm leading-7 text-site-secondary sm:text-[0.9375rem] sm:leading-8"
          >
            <p>
              Every piece from Woodley&apos;s includes complimentary inspection and
              cleaning with each showroom visit. Store jewelry separately, avoid
              harsh chemicals, and remove pieces before swimming or exercising.
            </p>
            <p>
              Need sizing, repair, or restoration? Our bench jewelers handle most
              work in-house — book a visit when you are ready.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
