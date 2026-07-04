"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalCheckoutButtons from "@/components/checkout/PayPalCheckoutButtons";

/**
 * @param {React.ComponentProps<typeof PayPalCheckoutButtons>} props
 */
export default function CheckoutPayPalSection(props) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
  if (!clientId) return null;

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalCheckoutButtons {...props} />
    </PayPalScriptProvider>
  );
}
