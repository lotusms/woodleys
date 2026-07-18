"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { isNavItemActive, desktopNavItemClass } from "@/config";
import { useDismissOnOutsidePress } from "@/hooks/useDismissOnOutsidePress";
import { usePrefersFineHover } from "@/hooks/usePrefersFineHover";

const HOVER_CLOSE_MS = 160;

/**
 * @param {{
 *   href: string;
 *   children: import("react").ReactNode;
 *   className?: string;
 *   close: () => void;
 * }} props
 */
function DropdownLink({ href, children, className = "", close }) {
  return (
    <Link href={href} onClick={() => close()} className={className}>
      {children}
    </Link>
  );
}

/**
 * @param {{
 *   link: import("@/config/navigation").NavLink;
 *   close: () => void;
 *   className: string;
 * }} props
 */
function IconGridLink({ link, close, className }) {
  return (
    <DropdownLink href={link.href} close={close} className={className}>
      {link.icon?.src ? (
        <span className="relative mb-1.5 inline-flex h-10 w-10 items-center justify-center">
          <Image
            src={link.icon.src}
            alt={link.icon.alt ?? ""}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </span>
      ) : null}
      <span>{link.label}</span>
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
  const closeTimerRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));
  const headingId = useId();
  const prefersFineHover = usePrefersFineHover();
  const active = isNavItemActive(pathname, item);
  const hasGroups = Array.isArray(item.groups) && item.groups.length > 0;
  const links = item.children ?? [];
  const pathnameRef = useRef(pathname);
  const groupCount = item.groups?.length ?? 0;
  const hasIconGrid = item.groups?.some((group) => group.layout === "iconGrid");
  const dualIconGrids =
    groupCount === 2 &&
    Boolean(item.groups?.every((group) => group.layout === "iconGrid"));

  const containerRefs = useRef([buttonRef, panelRef]);
  useDismissOnOutsidePress(open, close, containerRefs.current);

  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      pathnameRef.current = pathname;
      close();
    }
  }, [pathname, close]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const cancelHoverClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleHoverClose = () => {
    if (!prefersFineHover) return;
    cancelHoverClose();
    closeTimerRef.current = setTimeout(() => {
      close();
      closeTimerRef.current = null;
    }, HOVER_CLOSE_MS);
  };

  const openOnHover = () => {
    if (!prefersFineHover) return;
    cancelHoverClose();
    if (!open) {
      buttonRef.current?.click();
    }
  };

  const panelClassName = [
    "relative overflow-hidden",
    item.panelWide || hasIconGrid
      ? dualIconGrids
        ? "z-[120] w-[min(96vw,58rem)] rounded-sm border border-stone-200/80 bg-white p-5 shadow-lg shadow-stone-900/8 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
        : "z-[120] w-[min(94vw,48rem)] rounded-sm border border-stone-200/80 bg-white p-5 shadow-lg shadow-stone-900/8 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
      : "z-[120] w-max min-w-[14rem] max-w-[min(90vw,28rem)] rounded-sm border border-stone-200/80 bg-white p-4 shadow-lg shadow-stone-900/8 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in",
  ].join(" ");

  const linkClassName =
    "block rounded px-1 py-1.5 text-sm text-site-fg transition hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-1";

  const iconLinkClassName =
    "flex flex-col items-center rounded-sm px-2 py-2 text-center text-xs font-medium text-site-fg transition hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-1";

  const groupsClassName =
    dualIconGrids
      ? "grid gap-8 sm:grid-cols-2"
      : groupCount >= 3
        ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        : groupCount === 2
          ? "grid gap-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]"
          : "grid gap-4 sm:grid-cols-2";

  const exploreLabel = item.exploreLabel ?? `Explore ${item.label}`;

  return (
    <>
      <div onMouseEnter={openOnHover} onMouseLeave={scheduleHoverClose}>
        <PopoverButton
          ref={buttonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-current={active ? "page" : undefined}
          className={`${desktopNavItemClass} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-site-bg ${
            active || open
              ? "border-warm-gold text-site-fg"
              : "text-site-secondary hover:border-stone-300 hover:text-site-fg"
          }`}
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
        transition
        anchor={{ to: "bottom start", gap: 12, padding: 16 }}
        className={panelClassName}
        onMouseEnter={cancelHoverClose}
        onMouseLeave={scheduleHoverClose}
      >
        {({ close: closePanel }) => (
          <>
            {item.panelImage ? (
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="absolute inset-y-0 right-0 w-[58%]">
                  <Image
                    src={item.panelImage}
                    alt=""
                    fill
                    sizes="320px"
                    className="object-cover object-center opacity-45"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white from-35% via-white/88 via-55% to-white/25" />
              </div>
            ) : null}

            <nav aria-label={`${item.label} menu`} className="relative z-10">
              {hasGroups ? (
                <div className={groupsClassName}>
                  {item.groups.map((group, index) => {
                    const groupHeadingId = `${headingId}-g${index}`;
                    const isIconGrid = group.layout === "iconGrid";

                    return (
                      <div
                        key={group.heading ?? group.links[0]?.href}
                        className={isIconGrid ? "sm:col-span-1 lg:col-span-1" : undefined}
                      >
                        {group.heading ? (
                          <p
                            id={groupHeadingId}
                            className="mb-3 text-sm font-semibold text-site-fg"
                          >
                            {group.heading}
                          </p>
                        ) : null}
                        {group.seeAllHref ? (
                          <DropdownLink
                            href={group.seeAllHref}
                            close={closePanel}
                            className={`${linkClassName} mb-2`}
                          >
                            View all
                          </DropdownLink>
                        ) : null}
                        {isIconGrid ? (
                          <ul
                            className="grid grid-cols-3 gap-1 sm:grid-cols-3"
                            role="list"
                            aria-labelledby={
                              group.heading ? groupHeadingId : undefined
                            }
                          >
                            {group.links.map((link) => (
                              <li key={link.href}>
                                <IconGridLink
                                  link={link}
                                  close={closePanel}
                                  className={iconLinkClassName}
                                />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <ul
                            className="space-y-0.5"
                            role="list"
                            aria-labelledby={
                              group.heading ? groupHeadingId : undefined
                            }
                          >
                            {group.links.map((link) => (
                              <li key={link.href}>
                                <DropdownLink
                                  href={link.href}
                                  close={closePanel}
                                  className={linkClassName}
                                >
                                  {link.label}
                                </DropdownLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ul className="space-y-0.5" role="list">
                  {links.map((link) => (
                    <li key={link.href}>
                      <DropdownLink
                        href={link.href}
                        close={closePanel}
                        className={linkClassName}
                      >
                        {link.label}
                      </DropdownLink>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex justify-center border-t border-stone-100 pt-4">
                <DropdownLink
                  href={item.href}
                  close={closePanel}
                  className="inline-flex items-center justify-center rounded-sm border border-stone-300 bg-white/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-site-fg backdrop-blur-[2px] transition hover:border-warm-gold-dark hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2"
                >
                  {exploreLabel}
                </DropdownLink>
              </div>
            </nav>
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
