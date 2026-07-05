"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider as Provider } from "@/context/CartContext";

export default function CartProvider({ children }) {
  return (
    <Provider>
      {children}
      <CartDrawer />
    </Provider>
  );
}
