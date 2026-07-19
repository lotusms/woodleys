"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import SkipLink from "@/components/a11y/SkipLink";
import SiteLogo from "@/components/brand/SiteLogo";
import HeaderSearch from "@/components/navigation/HeaderSearch";
import NavCartLink from "@/components/navigation/NavCartLink";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useInertWhen } from "@/hooks/useInertWhen";
import {
  mainNav,
  isNavItemActive,
  getNavSections,
  orgPhone,
  orgPhoneTel,
  orgAddress,
  orgAddressMapsUrl,
  siteHeaderTopOffset,
  sitePageWideContainerClass,
} from "@/config";
import { headerUtilityPillClass, navIconTileClass } from "@/lib/navigation-tokens";

const AccountAuthMenu = dynamic(
  () => import("@/components/auth/AccountAuthMenu"),
  {
    ssr: false,
    loading: () => (
      <span className={headerUtilityPillClass} aria-hidden />
    ),
  },
);

const DesktopMainNav = dynamic(
  () => import("@/components/navigation/DesktopMainNav"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-6 w-full max-w-3xl items-center justify-center gap-5"
        aria-hidden
      >
        {["a", "b", "c", "d", "e", "f", "g", "h"].map((id) => (
          <span key={id} className="h-3 w-10 rounded-full bg-stone-200/50" />
        ))}
      </div>
    ),
  },
);

const MOBILE_MENU_INERT_TARGETS = ["main-content", "site-footer"];

/**
 * @param {{
 *   item: import("@/config/navigation").NavItem;
 *   pathname: string;
 *   onNavigate: () => void;
 *   index: number;
 *   open: boolean;
 *   expandedId: string | null;
 *   setExpandedId: (id: string | null) => void;
 * }} props
 */
function MobileAccordionItem({
  item,
  pathname,
  onNavigate,
  index,
  open,
  expandedId,
  setExpandedId,
}) {
  const panelId = useId();
  const sections = getNavSections(item);
  const hasChildren = sections.length > 0;
  const active = isNavItemActive(pathname, item);
  const itemKey = item.id || item.href;
  const expanded = expandedId === itemKey;

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        style={{ animationDelay: open ? `${60 + index * 40}ms` : "0ms" }}
        className={`mobile-nav-item block border-b border-stone-200/80 py-4 font-serif text-2xl transition ${
          active ? "text-warm-gold-dark" : "text-site-fg"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="mobile-nav-item border-b border-stone-200/80"
      style={{ animationDelay: open ? `${60 + index * 40}ms` : "0ms" }}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpandedId(expanded ? null : itemKey)}
        className="flex min-h-11 w-full items-center justify-between gap-3 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
      >
        <span
          className={`font-serif text-2xl ${active ? "text-warm-gold-dark" : "text-site-fg"}`}
        >
          {item.label}
        </span>
        <span
          className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-site-secondary"
          aria-hidden
        >
          {expanded ? "Close" : "Open"}
        </span>
      </button>
      {expanded ? (
        <ul id={panelId} className="space-y-2 pb-4 pl-3" role="list">
          <li>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block py-1 font-serif text-base text-site-fg hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
            >
              View all {item.label}
            </Link>
          </li>
          {sections.map((section) => (
            <li key={section.id || section.heading}>
              {section.heading ? (
                <p className="mb-1.5 mt-3 text-sm font-semibold text-site-fg first:mt-0">
                  {section.heading}
                </p>
              ) : null}
              {section.seeAllHref ? (
                <Link
                  href={section.seeAllHref}
                  onClick={onNavigate}
                  className="mb-2 block py-1 text-sm font-medium text-warm-gold-dark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                >
                  {section.seeAllLabel || `View all ${section.heading}`}
                </Link>
              ) : null}
              {section.layout === "iconGrid" ? (
                <ul
                  className="mb-3 grid w-max max-w-full grid-rows-2 gap-x-1 gap-y-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.ceil(section.links.length / 2)}, 5.25rem)`,
                  }}
                  role="list"
                >
                  {section.links.map((navLink) => (
                    <li key={navLink.id || navLink.href}>
                      <Link
                        href={navLink.href}
                        onClick={onNavigate}
                        aria-label={
                          navLink.visuallyHiddenContext || navLink.label
                        }
                        className="flex min-h-11 flex-col items-center rounded-sm px-1 py-2 text-center text-xs font-medium text-site-fg hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                      >
                        {navLink.symbol ? (
                          <span
                            className={`${navIconTileClass} mb-1 h-9 w-9 font-serif text-base font-semibold tracking-tight ${navLink.symbolClass || "text-site-fg"}`}
                            aria-hidden
                          >
                            {navLink.symbol}
                          </span>
                        ) : navLink.icon?.src ? (
                          <span
                            className={`${navIconTileClass} mb-1 h-9 w-9`}
                            aria-hidden
                          >
                            <Image
                              src={navLink.icon.src}
                              alt=""
                              width={28}
                              height={28}
                              className="h-7 w-7 object-contain"
                            />
                          </span>
                        ) : null}
                        <span aria-hidden={Boolean(navLink.visuallyHiddenContext)}>
                          {navLink.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mb-3 space-y-1.5" role="list">
                  {section.links.map((navLink) => (
                    <li key={navLink.id || navLink.href}>
                      <Link
                        href={navLink.href}
                        onClick={onNavigate}
                        aria-label={
                          navLink.visuallyHiddenContext || undefined
                        }
                        className="block py-1 text-sm text-site-fg hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                      >
                        {navLink.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(/** @type {string | null} */ (null));
  const [pathForMenu, setPathForMenu] = useState(pathname);
  const panelId = useId();
  const menuButtonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const mobilePanelRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  if (pathname !== pathForMenu) {
    setPathForMenu(pathname);
    setOpen(false);
    setExpandedId(null);
  }

  useFocusTrap(mobilePanelRef, open, {
    returnFocusRef: menuButtonRef,
    externalFocusRefs: [menuButtonRef],
  });
  useInertWhen(open, MOBILE_MENU_INERT_TARGETS);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <SkipLink />
      <header className="fixed inset-x-0 top-0 z-[110] border-b border-stone-200/70 bg-ivory/90 backdrop-blur-md">
        {/* Utility bar — store tools */}
        <div
          className="hidden border-b border-stone-200/50 xl:block"
          inert={open || undefined}
          aria-label="Store information and customer tools"
        >
          <div
            className={`${sitePageWideContainerClass} flex h-9 items-center justify-between gap-4 px-5 sm:px-8 lg:px-10`}
          >
            <div className="flex min-w-0 items-center gap-4">
              <a
                href={`tel:${orgPhoneTel}`}
                className="whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.16em] text-site-fg transition hover:text-warm-gold-dark"
              >
                {orgPhone}
              </a>
              <span
                className="h-3 w-px shrink-0 bg-stone-300/90"
                aria-hidden
              />
              <a
                href={orgAddressMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-[0.62rem] font-medium uppercase tracking-[0.14em] text-site-secondary transition hover:text-warm-gold-dark"
              >
                {orgAddress}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                prefetch
                className={headerUtilityPillClass}
              >
                Book a Visit
              </Link>
              <AccountAuthMenu onNavigate={close} />
            </div>
          </div>
        </div>

        {/* Brand + search */}
        <div
          className={`${sitePageWideContainerClass} flex h-[4.5rem] items-center justify-between gap-3 px-5 sm:px-8 lg:px-10 xl:h-16`}
          aria-label="Brand and search"
        >
          <div className="min-w-0 shrink" inert={open || undefined}>
            <SiteLogo variant="default" />
          </div>

          <div
            className="mx-4 hidden min-w-0 max-w-xl flex-1 xl:block"
            inert={open || undefined}
          >
            <HeaderSearch variant="field" />
          </div>

          <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2" inert={open || undefined}>
              <div className="xl:hidden">
                <HeaderSearch variant="icon" />
              </div>
              <div className="hidden md:block xl:hidden">
                <Link
                  href="/contact"
                  prefetch
                  className={headerUtilityPillClass}
                >
                  <span className="sm:hidden">Visit</span>
                  <span className="hidden sm:inline">Book Visit</span>
                </Link>
              </div>
              <div className="xl:hidden">
                <AccountAuthMenu onNavigate={close} />
              </div>
              <div className="hidden xl:block">
                <NavCartLink />
              </div>
              <div className="xl:hidden">
                <NavCartLink variant="icon" />
              </div>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-stone-300/80 bg-white text-site-fg xl:hidden"
              aria-expanded={open}
              aria-controls={panelId}
              aria-haspopup="dialog"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`h-0.5 w-5 origin-center rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 motion-reduce:transition-none ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-5 origin-center rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Primary category navigation */}
        <div
          className="hidden border-t border-stone-200/60 xl:block"
          inert={open || undefined}
        >
          <div
            className={`${sitePageWideContainerClass} flex min-h-11 items-center justify-center px-5 py-1.5 sm:px-8 lg:px-10`}
          >
            <nav aria-label="Primary">
              <DesktopMainNav />
            </nav>
          </div>
        </div>
      </header>

      <div
        id={panelId}
        ref={mobilePanelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        inert={!open || undefined}
        style={{ paddingTop: siteHeaderTopOffset }}
        className={`mobile-nav-panel fixed inset-0 z-[100] flex flex-col bg-ivory xl:hidden ${
          open
            ? "mobile-nav-panel--open visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-8 pt-2">
          <div className="mb-4">
            <HeaderSearch variant="field" onSubmit={close} />
          </div>
          <nav aria-label="Mobile primary" className="py-2">
            {mainNav.map((item, i) => (
              <MobileAccordionItem
                key={item.id || item.href}
                item={item}
                pathname={pathname}
                onNavigate={close}
                index={i}
                open={open}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
              />
            ))}
            <NavCartLink variant="mobile" onNavigate={close} />
            <a
              href={`tel:${orgPhoneTel}`}
              onClick={close}
              className="mobile-nav-item flex w-full items-center justify-between gap-3 border-b border-stone-200/80 py-4 text-left font-serif text-2xl text-site-fg"
            >
              Call the Store
              <span className="text-sm tracking-normal text-site-secondary">
                {orgPhone}
              </span>
            </a>
          </nav>
          <Link
            href="/contact"
            prefetch
            onClick={close}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-warm-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-warm-gold-dark"
          >
            Book a Visit
          </Link>
          <div className="mt-6 border-t border-stone-200/80 pt-6">
            <AccountAuthMenu
              onNavigate={close}
              className="w-full [&_button]:w-full [&_button]:justify-center"
            />
          </div>
        </div>
      </div>
    </>
  );
}
