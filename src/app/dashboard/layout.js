import DashboardAuthGate from "@/components/dashboard/DashboardAuthGate";
import { sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Dashboard"),
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return <DashboardAuthGate>{children}</DashboardAuthGate>;
}
