"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/account", label: "Overview", end: true },
  { href: "/account/orders", label: "Orders", end: false },
  { href: "/account/change-password", label: "Password", end: false },
];

/**
 * Member account chrome inside the main site layout (header + footer).
 */
export default function MemberAccountLayout({ children }) {
  const pathname = usePathname();
  const { user, userAccount } = useAuth();

  const greeting = useMemo(() => {
    if (userAccount.status !== "ready") return "My account";
    const first = String(userAccount.firstName ?? "").trim();
    if (first) return `${first}'s account`;
    const dn = String(user?.displayName ?? "").trim();
    if (dn) return `${dn.split(/\s+/)[0]}'s account`;
    return "My account";
  }, [userAccount, user?.displayName]);

  function isActive(href, end) {
    if (end) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="border-t border-stone-200/70 bg-site-bg">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <header className="max-w-3xl">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
            Member account
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl">
            {greeting}
          </h1>
          {user?.email ? (
            <p className="mt-3 text-sm text-site-secondary">{user.email}</p>
          ) : null}
        </header>

        <nav
          aria-label="Account sections"
          className="mt-10 flex flex-wrap gap-2 border-b border-stone-200/80 pb-px"
        >
          {navItems.map((item) => {
            const active = isActive(item.href, item.end);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-warm-gold text-site-fg"
                    : "border-transparent text-site-secondary hover:border-stone-300 hover:text-site-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
