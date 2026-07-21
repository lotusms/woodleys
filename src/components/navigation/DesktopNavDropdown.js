"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef } from "react";
import CatalogFilterLink from "@/components/catalog/CatalogFilterLink";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { isNavItemActive, desktopNavItemClass, getNavSections } from "@/config";
import { useDismissOnOutsidePress } from "@/hooks/useDismissOnOutsidePress";
import { usePrefersFineHover } from "@/hooks/usePrefersFineHover";
import {
  NAV_HOVER_CLOSE_MS,
  NAV_HOVER_OPEN_MS,
  navCompactPanelClass,
  navIconLinkClass,
  navIconTileClass,
  navLinkClass,
  navMegaPanelClass,
  navPanelSurfaceClass,
  navSectionHeadingClass,
  navTriggerCurrentClass,
  navTriggerIdleClass,
  navTriggerOpenClass,
} from "@/lib/navigation-tokens";

/**
 * @param {{
 *   href: string;
 *   children: import("react").ReactNode;
 *   className?: string;
 *   close: () => void;
 *   "aria-label"?: string;
 * }} props
 */
function DropdownLink({ href, children, className = "", close, ...rest }) {
  return (
    <CatalogFilterLink href={href} close={close} className={className} {...rest}>
      {children}
    </CatalogFilterLink>
  );
}

/**
 * @param {{
 *   link: import("@/config/navigation").NavLink;
 *   close: () => void;
 * }} props
 */
function IconGridLink({ link, close }) {
  const accessibleName =
    link.visuallyHiddenContext || link.label;

  return (
    <DropdownLink
      href={link.href}
      close={close}
      className={navIconLinkClass}
      aria-label={accessibleName}
    >
      {link.symbol ? (
        <span
          className={`${navIconTileClass} mb-1.5 h-10 w-10 font-serif text-lg font-semibold tracking-tight ${link.symbolClass || "text-site-fg"}`}
          aria-hidden
        >
          {link.symbol}
        </span>
      ) : link.icon?.src ? (
        <span className={`relative ${navIconTileClass} mb-1.5 h-10 w-10`} aria-hidden>
          <Image
            src={link.icon.src}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        </span>
      ) : null}
      <span aria-hidden={Boolean(link.visuallyHiddenContext)}>{link.label}</span>
    </DropdownLink>
  );
}

/**
 * @param {{
 *   item: import("@/config/navigation").NavItem;
 *   open: boolean;
 *   close: () => void;
 * }} props
 */
function DesktopNavDropdownPanel({ item, open, close }) {
  const pathname = usePathname();
  const buttonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const panelRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const openTimerRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));
  const closeTimerRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));
  const headingId = useId();
  const panelId = useId();
  const prefersFineHover = usePrefersFineHover();
  const active = isNavItemActive(pathname, item);
  const sections = getNavSections(item);
  const pathnameRef = useRef(pathname);
  const sectionCount = sections.length;
  const hasIconGrid = sections.some((section) => section.layout === "iconGrid");
  const menuType = item.menuType || (sectionCount >= 3 || hasIconGrid ? "mega" : "compact");
  const isMega = menuType === "mega";

  const dismissRefs = useMemo(() => [buttonRef, panelRef], []);
  useDismissOnOutsidePress(open, close, dismissRefs);

  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      pathnameRef.current = pathname;
      close();
    }
  }, [pathname, close]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const cancelTimers = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleHoverClose = () => {
    if (!prefersFineHover) return;
    cancelTimers();
    closeTimerRef.current = setTimeout(() => {
      close();
      closeTimerRef.current = null;
    }, NAV_HOVER_CLOSE_MS);
  };

  const openOnHover = () => {
    if (!prefersFineHover) return;
    cancelTimers();
    if (open) return;
    openTimerRef.current = setTimeout(() => {
      buttonRef.current?.click();
      openTimerRef.current = null;
    }, NAV_HOVER_OPEN_MS);
  };

  const footerAction =
    item.footerAction ||
    (item.href
      ? {
          id: `${item.id}-footer`,
          label: item.exploreLabel || `Explore ${item.label}`,
          href: item.href,
        }
      : null);

  /** Subgrid keeps headings and first items aligned; columns size to content. */
  const gridClassName =
    "grid auto-cols-max grid-flow-col grid-rows-[auto_auto] items-start gap-x-10 gap-y-0";

  const panelClassName = [
    "relative z-[120]",
    navPanelSurfaceClass,
    "p-5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-180 data-enter:ease-out data-leave:duration-150 data-leave:ease-in",
    isMega ? navMegaPanelClass : navCompactPanelClass,
  ].join(" ");

  const triggerStateClass = open
    ? navTriggerOpenClass
    : active
      ? navTriggerCurrentClass
      : navTriggerIdleClass;

  return (
    <>
      <div onMouseEnter={openOnHover} onMouseLeave={scheduleHoverClose}>
        <PopoverButton
          ref={buttonRef}
          type="button"
          id={`${panelId}-trigger`}
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="true"
          aria-current={active && !open ? "page" : undefined}
          className={`${desktopNavItemClass} cursor-pointer ${triggerStateClass}`}
        >
          <span className="whitespace-nowrap">{item.label}</span>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </PopoverButton>
      </div>

      <PopoverPanel
        ref={panelRef}
        id={panelId}
        transition
        anchor={{ to: "bottom start", gap: 12, padding: 16 }}
        className={panelClassName}
        onMouseEnter={cancelTimers}
        onMouseLeave={scheduleHoverClose}
      >
        {({ close: closePanel }) => (
          <>
            <div className="relative z-10">
              <nav aria-labelledby={`${panelId}-trigger`}>
                <div className={gridClassName}>
                  {sections.map((section, index) => {
                    const groupHeadingId = `${headingId}-g${index}`;
                    const isIconGrid = section.layout === "iconGrid";

                    return (
                      <div
                        key={section.id || section.heading}
                        className="row-span-2 grid min-w-0 grid-rows-subgrid gap-y-3"
                      >
                        {section.heading ? (
                          <p
                            id={groupHeadingId}
                            className={navSectionHeadingClass}
                          >
                            {section.heading}
                          </p>
                        ) : (
                          <span aria-hidden className="block" />
                        )}

                        <div className="min-w-0">
                          {isIconGrid ? (
                            <>
                              {section.seeAllHref ? (
                                <DropdownLink
                                  href={section.seeAllHref}
                                  close={closePanel}
                                  className={`${navLinkClass} mb-2 font-medium`}
                                >
                                  {section.seeAllLabel || "View all"}
                                  {section.seeAllLabel ? null : (
                                    <span className="sr-only">
                                      {" "}
                                      {section.heading}
                                    </span>
                                  )}
                                </DropdownLink>
                              ) : null}
                            <ul
                              className="grid w-max max-w-full grid-rows-2 gap-x-1 gap-y-2"
                              style={{
                                gridTemplateColumns: `repeat(${Math.ceil(section.links.length / 2)}, 5.25rem)`,
                              }}
                              role="list"
                              aria-labelledby={
                                section.heading ? groupHeadingId : undefined
                              }
                            >
                              {section.links.map((navLink) => (
                                <li key={navLink.id || navLink.href}>
                                  <IconGridLink
                                    link={navLink}
                                    close={closePanel}
                                  />
                                </li>
                              ))}
                            </ul>
                            </>
                          ) : (
                            <ul
                              className="space-y-0.5"
                              role="list"
                              aria-labelledby={
                                section.heading ? groupHeadingId : undefined
                              }
                            >
                              {section.seeAllHref ? (
                                <li>
                                  <DropdownLink
                                    href={section.seeAllHref}
                                    close={closePanel}
                                    className={`${navLinkClass} font-medium`}
                                  >
                                    {section.seeAllLabel || "View all"}
                                    {section.seeAllLabel ? null : (
                                      <span className="sr-only">
                                        {" "}
                                        {section.heading}
                                      </span>
                                    )}
                                  </DropdownLink>
                                </li>
                              ) : null}
                              {section.links.map((navLink) => (
                                <li key={navLink.id || navLink.href}>
                                  <DropdownLink
                                    href={navLink.href}
                                    close={closePanel}
                                    className={navLinkClass}
                                    aria-label={
                                      navLink.visuallyHiddenContext || undefined
                                    }
                                  >
                                    {navLink.label}
                                  </DropdownLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {footerAction ? (
                  <div className="mt-5 flex justify-center border-t border-stone-100 pt-4">
                    <DropdownLink
                      href={footerAction.href}
                      close={closePanel}
                      className="inline-flex items-center justify-center rounded-sm border border-stone-300 bg-white/90 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-site-fg transition hover:border-warm-gold-dark hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2"
                    >
                      {footerAction.label}
                    </DropdownLink>
                  </div>
                ) : null}
              </nav>
            </div>
          </>
        )}
      </PopoverPanel>
    </>
  );
}

/**
 * @param {import("@/config/navigation").NavItem} item
 */
export default function DesktopNavDropdown({ item }) {
  return (
    <Popover className="relative inline-flex items-center">
      {({ open, close }) => (
        <DesktopNavDropdownPanel item={item} open={open} close={close} />
      )}
    </Popover>
  );
}
