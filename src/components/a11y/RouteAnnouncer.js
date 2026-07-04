"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Announces document title changes to screen readers after in-app navigation. */
export default function RouteAnnouncer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const title = document.title.replace(/\s*\|\s*Woodley's Jewelers\s*$/, "").trim();
    setAnnouncement(title ? `Navigated to ${title}` : "Page loaded");
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
