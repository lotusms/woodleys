import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseAuth, getFirebaseStorage } from "@firebase/client";
import { slugifyProductHandle } from "@/lib/catalog/product-handle";

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/**
 * @param {string} name
 */
function sanitizeStorageFileName(name) {
  const trimmed = String(name ?? "").trim();
  const lastDot = trimmed.lastIndexOf(".");
  const base = lastDot > 0 ? trimmed.slice(0, lastDot) : trimmed;
  const ext = lastDot > 0 ? trimmed.slice(lastDot).toLowerCase() : "";
  const safeBase =
    base
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "image";
  const safeExt = ext.replace(/[^a-z0-9.]/gi, "").slice(0, 8);
  return `${safeBase}${safeExt || ".jpg"}`;
}

/**
 * @param {string} productFolder
 */
export function resolveProductStorageFolder(productFolder) {
  return slugifyProductHandle(productFolder) || "untitled-product";
}

/**
 * @param {File} file
 * @param {string} productFolder Product handle or title slug
 * @returns {Promise<string>} Public download URL
 */
export async function uploadProductImage(file, productFolder) {
  if (!file) {
    throw new Error("No file selected.");
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Please upload a JPEG, PNG, WebP, or GIF image.");
  }

  const folder = resolveProductStorageFolder(productFolder);
  const fileName = `${Date.now()}-${sanitizeStorageFileName(file.name)}`;
  const objectPath = `product/${folder}/${fileName}`;

  const auth = getFirebaseAuth();
  await auth.authStateReady();
  if (!auth.currentUser) {
    throw new Error("Sign in to upload product images.");
  }

  const storage = getFirebaseStorage();
  const objectRef = ref(storage, objectPath);

  await uploadBytes(objectRef, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
  });

  return getDownloadURL(objectRef);
}
