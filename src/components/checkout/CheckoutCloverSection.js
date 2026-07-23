"use client";

import CloverCheckoutForm from "@/components/checkout/CloverCheckoutForm";

/**
 * @param {React.ComponentProps<typeof CloverCheckoutForm>} props
 */
export default function CheckoutCloverSection(props) {
  const publicKey =
    process.env.NEXT_PUBLIC_CLOVER_PAKMS_KEY?.trim() ||
    process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY?.trim();
  const merchantId = process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID?.trim();
  if (!publicKey || !merchantId) return null;

  return <CloverCheckoutForm {...props} />;
}
