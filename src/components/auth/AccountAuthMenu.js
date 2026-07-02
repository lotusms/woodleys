"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { openAdminDashboardOrNavigate } from "@/lib/auth-routing";

const menuButtonClass =
  "inline-flex shrink-0 items-center gap-2 rounded-full border border-stone-300/80 bg-white px-2.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-site-fg transition hover:border-warm-gold hover:bg-champagne focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:px-4 sm:text-[0.65rem] sm:tracking-[0.18em]";

const menuItemsClass =
  "z-[130] w-52 origin-top-right rounded-xl border border-stone-200/80 bg-white/98 p-1.5 shadow-xl shadow-stone-900/10 backdrop-blur-md transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in";

const menuItemClass =
  "block w-full rounded-lg px-3 py-2.5 text-left text-sm text-site-fg transition data-focus:bg-champagne/80 data-focus:outline-none";

function GuestAccountMenu({ onNavigate, className }) {
  return (
    <Menu as="div" className={`relative shrink-0 ${className}`.trim()}>
      <MenuButton className={menuButtonClass} aria-label="Account">
        <UserIcon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden sm:inline">Account</span>
      </MenuButton>
      <MenuItems
        anchor={{ to: "bottom end", gap: 8, padding: 12 }}
        className={menuItemsClass}
      >
        <MenuItem>
          <Link href="/login" onClick={onNavigate} className={menuItemClass}>
            Sign in
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/register" onClick={onNavigate} className={menuItemClass}>
            Create account
          </Link>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

/**
 * Accessible account menu for the site header — sign in, register, account, portal, sign out.
 * @param {{ onNavigate?: () => void, className?: string }} props
 */
export default function AccountAuthMenu({ onNavigate, className = "" }) {
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();

  if (!user) {
    return <GuestAccountMenu onNavigate={onNavigate} className={className} />;
  }

  const label = isAdmin ? "Admin" : "Account";

  return (
    <Menu as="div" className={`relative shrink-0 ${className}`.trim()}>
      <MenuButton className={menuButtonClass} aria-label="Account menu">
        <UserIcon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden sm:inline">{label}</span>
      </MenuButton>
      <MenuItems
        anchor={{ to: "bottom end", gap: 8, padding: 12 }}
        className={menuItemsClass}
      >
        {isAdmin ? (
          <MenuItem>
            <button
              type="button"
              className={menuItemClass}
              onClick={() => {
                onNavigate?.();
                openAdminDashboardOrNavigate(router);
              }}
            >
              Open portal
              <span className="mt-0.5 block text-xs font-normal text-site-secondary">
                Opens in a new tab
              </span>
            </button>
          </MenuItem>
        ) : (
          <MenuItem>
            <Link
              href="/account"
              onClick={onNavigate}
              className={menuItemClass}
            >
              My account
            </Link>
          </MenuItem>
        )}
        <MenuItem>
          <button
            type="button"
            className={`${menuItemClass} text-rose-800 data-focus:bg-rose-50`}
            onClick={() => {
              onNavigate?.();
              void signOut();
            }}
          >
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
