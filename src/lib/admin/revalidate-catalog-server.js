import { revalidatePath, revalidateTag } from "next/cache";

/**
 * @param {{ handle?: string; collectionHandles?: string[] } | null | undefined} [product]
 */
export function revalidateAfterProductChange(product) {
  revalidateTag("catalog-products");
  revalidatePath("/");
  revalidatePath("/shop-all");

  if (!product) return;

  if (product.handle) {
    revalidateTag(`product-${product.handle}`);
    revalidatePath(`/products/${product.handle}`);
  }

  for (const collectionHandle of product.collectionHandles ?? []) {
    revalidateTag(`collection-${collectionHandle}`);
  }
}

/**
 * @param {string} handle
 * @param {string[]} [collectionHandles]
 */
export function revalidateAfterProductDelete(handle, collectionHandles = []) {
  revalidateTag("catalog-products");
  revalidateTag(`product-${handle}`);

  for (const collectionHandle of collectionHandles) {
    revalidateTag(`collection-${collectionHandle}`);
  }

  revalidatePath("/");
  revalidatePath("/shop-all");
  revalidatePath(`/products/${handle}`);
}
