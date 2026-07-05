import { sitePageEdgeMediaShellClass } from "@/config";

/** Product routes — left media column bleeds to the viewport; inset lives in the aside column. */
export default function ProductLayout({ children }) {
  return (
    <div data-page-layout="edge-media" className={sitePageEdgeMediaShellClass}>
      {children}
    </div>
  );
}
