"use client";

import dynamic from "next/dynamic";
import { CartProvider as Provider, useCart } from "@/context/CartContext";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), {
  ssr: false,
});

function CartDrawerHost() {
  const { isOpen } = useCart();
  if (!isOpen) return null;
  return <CartDrawer />;
}

export default function CartProvider({ children }) {
  return (
    <Provider>
      {children}
      <CartDrawerHost />
    </Provider>
  );
}
