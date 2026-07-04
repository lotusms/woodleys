"use client";

import * as dash from "@/lib/dashboardChrome";

/**
 * Compartmentalized dashboard form section — white panel with optional title + action.
 *
 * @param {{
 *   title?: string;
 *   action?: import("react").ReactNode;
 *   light: boolean;
 *   children: import("react").ReactNode;
 *   className?: string;
 * }} props
 */
export default function DashboardFormSection({
  title,
  action,
  light,
  children,
  className = "",
}) {
  return (
    <section className={`${dash.ordersPanel(light)} ${className}`.trim()}>
      {title || action ? (
        <div
          className={`flex flex-wrap items-center gap-3 ${title || action ? "mb-5" : ""} ${
            action ? "justify-between" : ""
          }`}
        >
          {title ? (
            <h2 className={dash.dashboardStatHeading(light)}>{title}</h2>
          ) : (
            <span />
          )}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
