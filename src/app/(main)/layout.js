import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import MainContent from "@/components/a11y/MainContent";
import VisitShowroomCta from "@/components/VisitShowroomCta";
import RouteTransitionProvider from "@/components/navigation/RouteTransitionProvider";
import { siteHeaderClearanceClass } from "@/config";

/** Main site shell — no page-level horizontal inset here; pages opt in via sitePageInsetClass. */
export default function MainSiteLayout({ children }) {
  return (
    <>
      <RouteTransitionProvider />
      <SiteHeader />
      <MainContent className={siteHeaderClearanceClass}>
        {children}
        <VisitShowroomCta />
      </MainContent>
      <SiteFooter />
    </>
  );
}
