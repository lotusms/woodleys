"use client";

import { useEffect, useState } from "react";
import * as dash from "@/lib/dashboardChrome";

/**
 * @param {{ src: string; alt?: string; light: boolean; label?: string }} props
 */
function ProductImagePreview({ src, alt = "", light, label = "Photo preview" }) {
  const [failed, setFailed] = useState(false);
  const trimmed = src.trim();

  useEffect(() => {
    setFailed(false);
  }, [trimmed]);

  const shellClass = light
    ? "border-stone-300/70 bg-stone-100 text-stone-500"
    : "border-slate-600/50 bg-slate-800 text-slate-400";

  return (
    <div
      className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border ${shellClass}`}
    >
      {trimmed && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={trimmed}
          alt={alt || label}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="px-2 text-center text-[0.62rem] font-medium uppercase tracking-[0.14em]">
          {trimmed && failed ? "Invalid image" : "No preview"}
        </span>
      )}
    </div>
  );
}

/**
 * Product photo editor row — preview, labeled URL field, and alt-text textarea.
 *
 * @param {{
 *   src: string;
 *   alt: string;
 *   onSrcChange: (value: string) => void;
 *   onAltChange: (value: string) => void;
 *   light: boolean;
 *   inputClassName: string;
 *   previewLabel?: string;
 *   urlLabel?: string;
 *   descriptionLabel?: string;
 *   showRemove?: boolean;
 *   onRemove?: () => void;
 * }} props
 */
export default function ProductPhotoField({
  src,
  alt,
  onSrcChange,
  onAltChange,
  light,
  inputClassName,
  previewLabel = "Photo preview",
  urlLabel = "Image URL",
  descriptionLabel = "Photo description (alt text)",
  showRemove = false,
  onRemove,
}) {
  const labelClass = `mb-2 block text-sm font-medium ${light ? "text-stone-700" : "text-slate-300"}`;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <ProductImagePreview src={src} alt={alt} light={light} label={previewLabel} />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <label className="block">
          <span className={labelClass}>{urlLabel}</span>
          <input
            type="url"
            value={src}
            onChange={(e) => onSrcChange(e.target.value)}
            placeholder="https://…"
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className={labelClass}>{descriptionLabel}</span>
          <textarea
            rows={3}
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe the image for accessibility and SEO"
            className={`${inputClassName} min-h-[4.5rem] resize-y`}
          />
        </label>

        {showRemove && onRemove ? (
          <div className="flex justify-end">
            <button type="button" className={dash.dashFormRemoveButton(light)} onClick={onRemove}>
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
