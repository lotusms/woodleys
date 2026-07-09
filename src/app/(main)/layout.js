import dynamic from "next/dynamic";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CartProvider from "@/components/CartProvider";
import MainContent from "@/components/a11y/MainContent";
import VisitShowroomCta from "@/components/VisitShowroomCta";
import { siteHeaderClearanceClass } from "@/config";

const RouteTransitionProvider = dynamic(
  () => import("@/components/navigation/RouteTransitionProvider"),
);

/** Main site shell — no page-level horizontal inset here; pages opt in via sitePageInsetClass. */
export default function MainSiteLayout({ children }) {
  return (
    <CartProvider>
      <RouteTransitionProvider />
      <SiteHeader />
      <MainContent className={siteHeaderClearanceClass}>
        {children}
        <VisitShowroomCta />
      </MainContent>
      <SiteFooter />
    </CartProvider>
  );
}
