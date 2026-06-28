"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { isNavItemActive } from "@/config";

/**
 * @param {import("@/config/navigation").NavItem} item
 */
export default function DesktopNavDropdown({ item }) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item);
  const hasGroups = Array.isArray(item.groups) && item.groups.length > 0;
  const links = item.children ?? [];

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <PopoverButton
            className={`inline-flex items-center gap-1 border-b-2 pb-0.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-site-bg ${
              active || open
                ? "border-warm-gold text-site-fg"
                : "border-transparent text-site-secondary hover:border-stone-300 hover:text-site-fg"
            }`}
          >
            <span>{item.label}</span>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </PopoverButton>

          <PopoverPanel
            transition
            className="absolute left-1/2 z-50 mt-3 w-max min-w-[14rem] max-w-[min(90vw,28rem)] -translate-x-1/2 rounded-sm border border-stone-200/80 bg-white/95 p-4 shadow-lg shadow-stone-900/8 backdrop-blur-sm transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
          >
            <div className="mb-3 border-b border-stone-100 pb-3">
              <Link
                href={item.href}
                onClick={() => close()}
                className="font-serif text-base text-site-fg transition hover:text-warm-gold-dark"
              >
                View all {item.label}
              </Link>
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
                          <Link
                            href={link.href}
                            onClick={() => close()}
                            className="block rounded px-1 py-1 text-sm text-site-fg transition hover:bg-champagne/80 hover:text-warm-gold-dark focus-visible:bg-champagne/80"
                          >
                            {link.label}
                          </Link>
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
                    <Link
                      href={link.href}
                      onClick={() => close()}
                      className="block rounded px-1 py-1 text-sm text-site-fg transition hover:bg-champagne/80 hover:text-warm-gold-dark focus-visible:bg-champagne/80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
