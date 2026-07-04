import DashboardProductsPage from "@/components/dashboard/DashboardProductsPage";
import { sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Products"),
};

export default function ProductsPage() {
  return <DashboardProductsPage />;
}
