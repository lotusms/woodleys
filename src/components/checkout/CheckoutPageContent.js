"use client";

import { useRouter } from "next/navigation";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";
import PageLayout from "@/components/PageLayout";
import SecondaryButton from "@/components/ui/SecondaryButton";

export default function CheckoutPageContent() {
  const router = useRouter();

  return (
    <PageLayout
      eyebrow="Checkout"
      title="Complete your order"
      subtitle="Review your details and complete payment securely."
      buttonArea={
        <SecondaryButton href="/cart" icon={<span>←</span>}>
          Back to cart
        </SecondaryButton>
      }
    >
      <CheckoutFlow
        variant="page"
        onBackToCart={() => router.push("/cart")}
      />
    </PageLayout>
  );
}
