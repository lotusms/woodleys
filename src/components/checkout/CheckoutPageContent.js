"use client";

import CheckoutFlow from "@/components/checkout/CheckoutFlow";
import PageLayout from "@/components/PageLayout";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useCart } from "@/context/CartContext";

export default function CheckoutPageContent() {
  const { openCart } = useCart();

  return (
    <PageLayout
      eyebrow="Checkout"
      title="Complete your order"
      subtitle="Review your details and complete payment securely."
      buttonArea={
        <SecondaryButton type="button" onClick={openCart} icon={<span>←</span>}>
          Back to cart
        </SecondaryButton>
      }
    >
      <CheckoutFlow variant="page" onBackToCart={openCart} />
    </PageLayout>
  );
}
