"use client";

import Card from "@/components/ui/Card";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

export const CONTACT_APPOINTMENT_HELPFUL_LINES = [
  "The occasion or timeline you are working toward",
  "Styles, metals, or stones you are drawn to",
  "Pieces you would like to bring in for repair or redesign",
  "Whether you prefer morning or afternoon",
];

/**
 * @param {{ lines?: string[]; embedded?: boolean }} props
 */
export default function ContactHelpfulDetailsCard({
  lines = CONTACT_APPOINTMENT_HELPFUL_LINES,
  embedded = false,
}) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const body = light ? "text-stone-800/95" : "text-site-fg/90";
  const footer = light ? "text-stone-600" : "text-site-secondary";
  const footerBorder = light ? "border-stone-300/50" : "border-site-fg/10";

  return (
    <Card
      variant="inset"
      title="Helpful details to include"
      titleTag="h3"
      className={
        embedded
          ? "mt-8 min-w-0 rounded-sm border-stone-200/70 bg-champagne/35 p-5 shadow-none ring-0 sm:p-6"
          : "min-w-0 flex-9"
      }
      titleClassName={
        embedded
          ? "text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-site-secondary"
          : undefined
      }
    >
      <p className={`${embedded ? "mt-4" : "mt-8"} text-sm leading-7 ${body}`}>
        To help us respond more clearly, please include in your notes:
      </p>
      <ul className={`mt-4 space-y-3 text-sm leading-relaxed ${body}`}>
        {lines.map((line) => (
          <li key={line} className="flex gap-3">
            <span
              className={
                light
                  ? "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 shadow-[0_0_8px] shadow-amber-500/35"
                  : "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/80 shadow-[0_0_10px] shadow-amber-400/40"
              }
              aria-hidden
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      {!embedded ? (
        <p
          className={`mt-8 border-t px-12 pt-6 text-center text-xs uppercase tracking-[0.22em] ${footerBorder} ${footer}`}
        >
          Appointment requests are confirmed personally, usually within one business day.
        </p>
      ) : null}
    </Card>
  );
}
