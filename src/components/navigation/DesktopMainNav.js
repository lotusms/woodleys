"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PopoverGroup } from "@headlessui/react";
import DesktopNavDropdown from "@/components/navigation/DesktopNavDropdown";
import {
  mainNav,
  isNavItemActive,
  desktopNavItemClass,
  getNavSections,
} from "@/config";
import {
  navTriggerCurrentClass,
  navTriggerIdleClass,
} from "@/lib/navigation-tokens";

function NavLink({ item }) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`${desktopNavItemClass} ${
        active ? navTriggerCurrentClass : navTriggerIdleClass
      }`}
    >
      <span className="whitespace-nowrap">{item.label}</span>
    </Link>
  );
}

export default function DesktopMainNav() {
  return (
    <PopoverGroup
      as="ul"
      role="list"
      className="flex flex-nowrap items-center justify-center gap-x-3 xl:gap-x-3.5 2xl:gap-x-5"
    >
      {mainNav.map((item) => {
        const hasDropdown = getNavSections(item).length > 0;

        return (
          <li key={item.id || item.href} className="inline-flex">
            {hasDropdown ? (
              <DesktopNavDropdown item={item} />
            ) : (
              <NavLink item={item} />
            )}
          </li>
        );
      })}
    </PopoverGroup>
  );
}
