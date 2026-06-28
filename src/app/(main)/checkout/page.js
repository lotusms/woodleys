import { redirect } from "next/navigation";
import { getShopifyCheckoutUrl, isShopifyConfigured } from "@/lib/shopify/config";

export default function CheckoutPage() {
  if (isShopifyConfigured()) {
    const url = getShopifyCheckoutUrl();
    if (url) redirect(url);
  }

  redirect("/shop-all");
}
