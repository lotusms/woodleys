"use client";

import Link from "next/link";
import { useMemo } from "react";
import { RiArrowRightLine, RiShoppingBag3Line } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

export default function AccountHomePage() {
  const { user, userAccount } = useAuth();

  const greeting = useMemo(() => {
    if (userAccount.status !== "ready") return "Welcome";
    const first = String(userAccount.firstName ?? "").trim();
    if (first) return `Welcome back, ${first}`;
    const dn = String(user?.displayName ?? "").trim();
    if (dn) return `Welcome back, ${dn.split(/\s+/)[0]}`;
    return "Welcome back";
  }, [userAccount, user?.displayName]);

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] text-site-fg sm:text-3xl">
          {greeting}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-site-secondary">
          Review your orders, update your password, and keep your contact details
          current for a smooth checkout experience at Woodley&apos;s Jewelers.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          href="/account/profile"
          className="group rounded-2xl border border-stone-200/80 bg-white/90 p-7 shadow-sm shadow-stone-400/10 transition hover:border-warm-gold/40 hover:shadow-md"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-site-secondary">
            Your profile
          </p>
          <h3 className="mt-4 font-serif text-xl font-medium text-site-fg">
            Contact & addresses
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-site-secondary">
            Review saved shipping and billing details used at checkout.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-warm-gold-dark">
            View profile
            <RiArrowRightLine
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>

        <Link
          href="/account/orders"
          className="group rounded-2xl border border-stone-200/80 bg-white/90 p-7 shadow-sm shadow-stone-400/10 transition hover:border-warm-gold/40 hover:shadow-md"
        >
          <RiShoppingBag3Line
            className="h-9 w-9 text-warm-gold-dark"
            aria-hidden
          />
          <h3 className="mt-5 font-serif text-xl font-medium text-site-fg">
            Purchase history
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-site-secondary">
            View past orders, receipts, and shipment details.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-warm-gold-dark">
            View orders
            <RiArrowRightLine
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-1">
        <Link
          href="/shop"
          className="group rounded-2xl border border-stone-200/80 bg-champagne/30 p-7 shadow-sm shadow-stone-400/10 transition hover:border-warm-gold/40 hover:shadow-md"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-site-secondary">
            Continue shopping
          </p>
          <h3 className="mt-4 font-serif text-xl font-medium text-site-fg">
            Browse the collection
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-site-secondary">
            Engagement rings, fine jewelry, watches, and custom design.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-site-fg">
            Shop now
            <RiArrowRightLine
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>
      </div>

      <p className="text-sm text-site-secondary">
        Questions about an order?{" "}
        <Link
          href="/contact"
          className="font-medium text-warm-gold-dark underline decoration-warm-gold/40 underline-offset-4 transition hover:text-site-fg"
        >
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
