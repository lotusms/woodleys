"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import SiteLogo from "@/components/brand/SiteLogo";
import AccountAuthMenu from "@/components/auth/AccountAuthMenu";
import DesktopNavDropdown from "@/components/navigation/DesktopNavDropdown";
import { PopoverGroup } from "@headlessui/react";
import {
  mainNav,
  isNavItemActive,
  orgPhone,
  orgPhoneTel,
  siteHeaderTopOffset,
} from "@/config";

function NavLink({ href, label, prefix, onNavigate, className = "" }) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, { href, prefix });

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`border-b-2 pb-0.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] transition-colors ${className} ${
        active
          ? "border-warm-gold text-site-fg"
          : "border-transparent text-site-secondary hover:border-stone-300 hover:text-site-fg"
      }`}
    >
      {label}
    </Link>
  );
}

function DesktopMainNav() {
  return (
    <PopoverGroup className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 xl:gap-x-6">
      {mainNav.map((item) => {
        const hasDropdown =
          (item.children && item.children.length > 0) ||
          (item.groups && item.groups.length > 0);

        if (hasDropdown) {
          return <DesktopNavDropdown key={item.href} item={item} />;
        }

        return (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            prefix={item.prefix}
          />
        );
      })}
    </PopoverGroup>
  );
}

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
      <div className="flex items-center justify-between gap-3 py-3">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={`font-serif text-2xl ${active ? "text-warm-gold-dark" : "text-site-fg"}`}
        >
          {item.label}
        </Link>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className="rounded px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-site-secondary hover:bg-champagne focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
        >
          {expanded ? "Close" : "Menu"}
        </button>
      </div>
      {expanded ? (
        <ul id={panelId} className="space-y-2 pb-4 pl-3" role="list">
          {item.groups
            ? item.groups.map((group) => (
                <li key={group.heading ?? group.links[0]?.href}>
                  {group.heading ? (
                    <p className="mb-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary">
                      {group.heading}
                    </p>
                  ) : null}
                  <ul className="mb-3 space-y-1.5" role="list">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={onNavigate}
                          className="block py-1 text-sm text-site-fg hover:text-warm-gold-dark"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            : childLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="block py-1 text-sm text-site-fg hover:text-warm-gold-dark"
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
          <SiteLogo variant="default" />

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={`tel:${orgPhoneTel}`}
              className="whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.16em] text-site-fg transition hover:text-warm-gold-dark sm:text-[0.65rem] sm:tracking-[0.18em]"
            >
              {orgPhone}
            </a>
            <Link
              href="/appointments"
              className="inline-flex shrink-0 rounded-full border border-stone-300/80 bg-white px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-site-fg transition hover:border-warm-gold hover:bg-champagne sm:px-4 sm:text-[0.65rem] sm:tracking-[0.2em]"
            >
              Book Visit
            </Link>
            <AccountAuthMenu onNavigate={close} />
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-stone-300/80 bg-white text-site-fg xl:hidden"
              aria-expanded={open}
              aria-controls={panelId}
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

        <div className="hidden border-t border-stone-200/60 xl:block">
          <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-center px-5 py-2.5 sm:px-8 lg:px-10">
            <nav aria-label="Main" className="flex flex-wrap items-center justify-center">
              <DesktopMainNav />
            </nav>
          </div>
        </div>
      </header>

      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        style={{ paddingTop: siteHeaderTopOffset }}
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
          </nav>
          <Link
            href="/appointments"
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
