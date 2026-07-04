"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { isNavItemActive, desktopNavItemClass } from "@/config";
import { useDismissOnOutsidePress } from "@/hooks/useDismissOnOutsidePress";

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
 *   item: import("@/config/navigation").NavItem;
 *   open: boolean;
 *   close: () => void;
 * }} props
 */
function DesktopNavDropdownPanel({ item, open, close }) {
  const pathname = usePathname();
  const buttonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const panelRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const active = isNavItemActive(pathname, item);
  const hasGroups = Array.isArray(item.groups) && item.groups.length > 0;
  const links = item.children ?? [];
  const pathnameRef = useRef(pathname);

  const containerRefs = useRef([buttonRef, panelRef]);
  useDismissOnOutsidePress(open, close, containerRefs.current);

  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      pathnameRef.current = pathname;
      close();
    }
  }, [pathname, close]);

  const panelClassName =
    "z-[120] w-max min-w-[14rem] max-w-[min(90vw,28rem)] rounded-sm border border-stone-200/80 bg-white/95 p-4 shadow-lg shadow-stone-900/8 backdrop-blur-sm transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in";

  const linkClassName =
    "block rounded px-1 py-1 text-sm text-site-fg transition hover:bg-champagne/80 hover:text-warm-gold-dark focus-visible:bg-champagne/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-1";

  return (
    <>
      <PopoverButton
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
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

      <PopoverPanel
        ref={panelRef}
        transition
        anchor={{ to: "bottom", gap: 12, padding: 16 }}
        className={panelClassName}
      >
        {({ close: closePanel }) => (
          <nav aria-label={`${item.label} menu`}>
            <div className="mb-3 border-b border-stone-100 pb-3">
              <DropdownLink
                href={item.href}
                close={closePanel}
                className="font-serif text-base text-site-fg transition hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2"
              >
                View all {item.label}
              </DropdownLink>
            </div>

            {hasGroups ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {item.groups.map((group) => (
                  <div key={group.heading ?? group.links[0]?.href}>
                    {group.heading ? (
                      <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-site-secondary">
                        {group.heading}
                      </p>
                    ) : null}
                    <ul className="space-y-1.5" role="list">
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
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-1.5" role="list">
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
          </nav>
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
