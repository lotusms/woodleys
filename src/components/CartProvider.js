"use client";

import dynamic from "next/dynamic";
import { CartProvider as Provider } from "@/context/CartContext";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), {
  ssr: false,
});

export default function CartProvider({ children }) {
  return (
    <Provider>
      {children}
      <CartDrawer />
    </Provider>
  );
}
