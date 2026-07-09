"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { uploadProductImage, resolveProductStorageFolder } from "@/lib/product-storage";
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
 * Product photo editor — preview, drag-and-drop upload, URL field, and alt text.
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
 *   storageFolder?: string;
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
  storageFolder = "",
}) {
  const inputId = useId();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const labelClass = `mb-2 block text-sm font-medium ${light ? "text-stone-700" : "text-slate-300"}`;
  const canUpload = Boolean(storageFolder.trim());
  const storagePathLabel = canUpload
    ? resolveProductStorageFolder(storageFolder)
    : "";

  const uploadFile = useCallback(
    async (file) => {
      if (!canUpload) {
        setUploadError("Enter a product name or URL handle before uploading.");
        return;
      }

      setUploading(true);
      setUploadError("");

      try {
        const downloadUrl = await uploadProductImage(file, storageFolder);
        onSrcChange(downloadUrl);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Could not upload image.",
        );
      } finally {
        setUploading(false);
      }
    },
    [canUpload, onSrcChange, storageFolder],
  );

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (!file) return;
      void uploadFile(file);
    },
    [uploadFile],
  );

  function onDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!uploading) setDragActive(true);
  }

  function onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }

  function onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (uploading) return;
    handleFiles(event.dataTransfer.files);
  }

  const dropZoneClass = [
    "relative flex min-h-[6.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition",
    light
      ? "border-stone-300/80 bg-stone-50/80 text-stone-600 hover:border-amber-400/70 hover:bg-amber-50/40"
      : "border-slate-600/60 bg-slate-900/30 text-slate-300 hover:border-amber-400/50 hover:bg-slate-800/50",
    dragActive
      ? light
        ? "border-amber-500 bg-amber-50/70"
        : "border-amber-400/80 bg-slate-800/70"
      : "",
    uploading || !canUpload ? "pointer-events-none opacity-60" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <ProductImagePreview src={src} alt={alt} light={light} label={previewLabel} />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div
          className={dropZoneClass}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => {
            if (!uploading && canUpload) fileInputRef.current?.click();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!uploading && canUpload) fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={canUpload && !uploading ? 0 : -1}
          aria-disabled={!canUpload || uploading}
          aria-labelledby={`${inputId}-drop-label`}
        >
          <ArrowUpTrayIcon className="h-5 w-5 opacity-70" aria-hidden />
          <p id={`${inputId}-drop-label`} className="text-sm font-medium">
            {uploading
              ? "Uploading…"
              : dragActive
                ? "Drop image to upload"
                : "Drag and drop an image, or click to browse"}
          </p>
          <p className="text-xs opacity-75">
            {canUpload
              ? `Saved to product/${storagePathLabel}/ in Firebase Storage`
              : "Add a product name or URL handle to enable uploads"}
          </p>
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={!canUpload || uploading}
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {uploadError ? (
          <p className={dash.dashErrorBanner(light)} role="alert">
            {uploadError}
          </p>
        ) : null}

        <label className="block">
          <span className={labelClass}>{urlLabel}</span>
          <input
            type="url"
            value={src}
            onChange={(e) => onSrcChange(e.target.value)}
            placeholder="https://… or upload above"
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
