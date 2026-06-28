import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { siteHeaderClearanceClass } from "@/config";

export default function MainSiteLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <div className={siteHeaderClearanceClass}>{children}</div>
      <SiteFooter />
    </>
  );
}
