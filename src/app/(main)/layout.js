import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import MainContent from "@/components/a11y/MainContent";
import VisitShowroomCta from "@/components/VisitShowroomCta";
import { siteHeaderClearanceClass } from "@/config";

export default function MainSiteLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <MainContent className={siteHeaderClearanceClass}>
        {children}
        <VisitShowroomCta />
      </MainContent>
      <SiteFooter />
    </>
  );
}
