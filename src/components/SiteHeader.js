"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import SiteLogo from "@/components/brand/SiteLogo";
import NavCartLink from "@/components/navigation/NavCartLink";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useInertWhen } from "@/hooks/useInertWhen";
import {
  mainNav,
  isNavItemActive,
  orgPhone,
  orgPhoneTel,
  siteHeaderTopOffset,
} from "@/config";

const AccountAuthMenu = dynamic(
  () => import("@/components/auth/AccountAuthMenu"),
  {
    ssr: false,
    loading: () => (
      <span
        className="inline-flex h-10 shrink-0 items-center rounded-full border border-stone-300/80 bg-white px-2.5 sm:min-w-[6.75rem] sm:px-4"
        aria-hidden
      />
    ),
  }
);

const DesktopMainNav = dynamic(
  () => import("@/components/navigation/DesktopMainNav"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-6 w-full max-w-xl items-center justify-center gap-5"
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

function MobileAccordionItem({ item, pathname, onNavigate, index, open }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const hasChildren =
    (item.children && item.children.length > 0) ||
    (item.groups && item.groups.length > 0);
  const active = isNavItemActive(pathname, item);

  const childLinks = hasChildren
    ? item.groups
      ? item.groups.flatMap((g) => g.links)
      : item.children
    : [];

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
        aria-label={
          expanded ? `Collapse ${item.label} menu` : `Expand ${item.label} menu`
        }
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
      >
        <span
          className={`font-serif text-2xl ${active ? "text-warm-gold-dark" : "text-site-fg"}`}
          aria-hidden
        >
          {item.label}
        </span>
        <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-site-secondary" aria-hidden>
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
          {item.groups
            ? item.groups.map((group) => (
                <li key={group.heading ?? group.links[0]?.href}>
                  {group.heading ? (
                    <p className="mb-1.5 mt-3 text-sm font-semibold text-site-fg first:mt-0">
                      {group.heading}
                    </p>
                  ) : null}
                  {group.layout === "iconGrid" ? (
                    <ul
                      className="mb-3 grid grid-cols-3 gap-2"
                      role="list"
                    >
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={onNavigate}
                            className="flex flex-col items-center rounded-sm px-1 py-2 text-center text-xs font-medium text-site-fg hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                          >
                            {link.icon?.src ? (
                              <Image
                                src={link.icon.src}
                                alt={link.icon.alt ?? ""}
                                width={36}
                                height={36}
                                className="mb-1 h-9 w-9 object-contain"
                              />
                            ) : null}
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="mb-3 space-y-1.5" role="list">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={onNavigate}
                            className="block py-1 text-sm text-site-fg hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))
            : childLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="block py-1 text-sm text-site-fg hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                  >
                    {link.label}
                  </Link>
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
  const panelId = useId();
  const menuButtonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const mobilePanelRef = useRef(/** @type {HTMLDivElement | null} */ (null));

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
    setOpen(false);
  }, [pathname]);

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
      <header className="fixed inset-x-0 top-0 z-[110] border-b border-stone-200/70 bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="min-w-0" inert={open}>
            <SiteLogo variant="default" />
          </div>

          <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2 md:gap-3">
            <div
              className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2 md:gap-3"
              inert={open}
            >
              <a
                href={`tel:${orgPhoneTel}`}
                className="hidden whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.16em] text-site-fg transition hover:text-warm-gold-dark md:inline sm:text-[0.65rem] sm:tracking-[0.18em]"
              >
                {orgPhone}
              </a>
              <Link
                href="/contact"
                prefetch
                className="inline-flex shrink-0 rounded-full border border-stone-300/80 bg-white px-2.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-site-fg transition hover:border-warm-gold hover:bg-champagne sm:px-4 sm:text-[0.65rem] sm:tracking-[0.2em]"
              >
                <span className="sm:hidden">Visit</span>
                <span className="hidden sm:inline">Book Visit</span>
              </Link>
              <AccountAuthMenu onNavigate={close} />
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-stone-300/80 bg-white text-site-fg xl:hidden"
              aria-expanded={open}
              aria-controls={panelId}
              aria-haspopup="dialog"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`h-0.5 w-5 origin-center rounded-full bg-current transition-transform duration-300 ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-5 origin-center rounded-full bg-current transition-transform duration-300 ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className="hidden border-t border-stone-200/60 xl:block"
          inert={open}
        >
          <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-center px-5 py-2.5 sm:px-8 lg:px-10">
            <nav aria-label="Main" className="flex flex-wrap items-center justify-center">
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
        inert={!open}
        style={{
          paddingTop: siteHeaderTopOffset,
        }}
        className={`mobile-nav-panel fixed inset-0 z-[100] flex flex-col bg-ivory xl:hidden ${
          open
            ? "mobile-nav-panel--open visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-8">
          <nav aria-label="Mobile main" className="py-4">
            {mainNav.map((item, i) => (
              <MobileAccordionItem
                key={item.href}
                item={item}
                pathname={pathname}
                onNavigate={close}
                index={i}
                open={open}
              />
            ))}
            <NavCartLink variant="mobile" onNavigate={close} />
          </nav>
          <Link
            href="/contact"
            prefetch
            onClick={close}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-warm-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-warm-gold-dark"
          >
            Request an Appointment
          </Link>
          <div className="mt-6 border-t border-stone-200/80 pt-6">
            <AccountAuthMenu onNavigate={close} className="w-full [&_button]:w-full [&_button]:justify-center" />
          </div>
        </div>
      </div>
    </>
  );
}
