"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PopoverGroup } from "@headlessui/react";
import DesktopNavDropdown from "@/components/navigation/DesktopNavDropdown";
import NavCartLink from "@/components/navigation/NavCartLink";
import { mainNav, isNavItemActive, desktopNavItemClass } from "@/config";

function NavLink({ href, label, prefix }) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, { href, prefix });

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${desktopNavItemClass} ${
        active
          ? "border-warm-gold text-site-fg"
          : "text-site-secondary hover:border-stone-300 hover:text-site-fg"
      }`}
    >
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}

export default function DesktopMainNav() {
  return (
    <PopoverGroup className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 xl:gap-x-4 2xl:gap-x-5">
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
      <NavCartLink />
    </PopoverGroup>
  );
}
