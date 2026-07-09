"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { listDashboardProducts } from "@/lib/catalog/firestore-products-browser";
import { useAuth } from "@/context/AuthContext";

/** @type {React.Context<null | { products: Record<string, unknown>[]; loading: boolean; refresh: () => Promise<void>; replaceProduct: (product: Record<string, unknown>) => void; removeProduct: (handle: string) => void }>} */
const DashboardProductsContext = createContext(null);

export function DashboardProductsProvider({ children }) {
  const pathname = usePathname();
  const { user, loading: authLoading, accountLoading, isAdmin } = useAuth();
  const isProductsRoute = pathname.startsWith("/dashboard/products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listDashboardProducts();
      setProducts(items);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isProductsRoute || authLoading || accountLoading || !user || !isAdmin) {
      return;
    }
    void refresh();
  }, [isProductsRoute, authLoading, accountLoading, user, isAdmin, refresh]);

  const replaceProduct = useCallback((product) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.handle === product.handle ? product : item,
      ),
    );
  }, []);

  const removeProduct = useCallback((handle) => {
    setProducts((prev) => prev.filter((item) => item.handle !== handle));
  }, []);

  const value = useMemo(
    () => ({
      products,
      loading,
      refresh,
      replaceProduct,
      removeProduct,
      isProductsRoute,
    }),
    [products, loading, refresh, replaceProduct, removeProduct, isProductsRoute],
  );

  return (
    <DashboardProductsContext.Provider value={value}>
      {children}
    </DashboardProductsContext.Provider>
  );
}

export function useDashboardProducts() {
  const ctx = useContext(DashboardProductsContext);
  if (!ctx) {
    throw new Error("useDashboardProducts must be used within DashboardProductsProvider");
  }
  return ctx;
}
