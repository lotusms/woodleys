"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import OrderDetailDialog from "@/components/account/OrderDetailDialog";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { fetchOrdersForCurrentUser } from "@/lib/orders-queries";
import {
  getSampleOrdersForProfile,
} from "@/lib/orders-sample-data";
import { getSampleProfileById } from "@/lib/profile-sample-data";
import { formatUsd } from "@/lib/money";

function formatWhen(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(iso);
  }
}

/** @param {unknown[]} lines */
function linesPreview(lines) {
  if (!Array.isArray(lines) || lines.length === 0) return "Order";
  const first = lines.find(
    (l) => l && typeof l === "object" && typeof l.title === "string" && l.title.trim(),
  );
  return first ? String(first.title).trim() : `${lines.length} item(s)`;
}

/** @param {{ demoProfileId?: string }} [props] */
export default function MemberOrdersPage({ demoProfileId: demoProfileIdProp }) {
  const searchParams = useSearchParams();
  const demoProfileId = demoProfileIdProp || searchParams.get("demo");
  const isDemo = Boolean(demoProfileId);
  const demoProfile = useMemo(
    () => (demoProfileId ? getSampleProfileById(demoProfileId) : null),
    [demoProfileId],
  );

  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    if (isDemo && demoProfileId) {
      setLoading(true);
      setError("");
      setOrders(getSampleOrdersForProfile(demoProfileId));
      setLoading(false);
      return;
    }

    if (authLoading || !user?.email) {
      if (!authLoading) setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const list = await fetchOrdersForCurrentUser();
        if (!cancelled) setOrders(list);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load orders.");
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, isDemo, demoProfileId]);

  const accountLabel = isDemo
    ? demoProfile?.email || "demo profile"
    : user?.email || "your account";
  const backHref = isDemo && demoProfileId ? `/profile/${demoProfileId}` : "/account/profile";

  if (!isDemo && authLoading) {
    return <p className="text-sm text-site-secondary">Loading…</p>;
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
            Order history
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-[-0.03em] text-site-fg">
            Your orders
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-site-secondary">
            {isDemo
              ? `Sample orders for ${accountLabel} (demo profile).`
              : `Orders placed with ${accountLabel} at checkout.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton href={backHref}>Back to profile</SecondaryButton>
          <PrimaryButton href="/" className="px-6">
            Home
          </PrimaryButton>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-site-secondary">Loading orders…</p>
      ) : error ? (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <Card variant="inset">
          <p className="text-sm text-site-secondary">No orders yet.</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex text-sm font-semibold text-warm-gold-dark hover:text-site-fg"
          >
            Browse the shop →
          </Link>
        </Card>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const lines = Array.isArray(order.lines) ? order.lines : [];
            return (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => setSelectedOrderId(String(order.id))}
                  className="w-full rounded-xl border border-stone-200/80 bg-white/80 p-4 text-left shadow-sm transition hover:border-warm-gold/40 hover:bg-white sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-site-fg">{order.id}</p>
                      <p className="mt-1 text-sm text-site-secondary">
                        {formatWhen(order.createdAt)} · {linesPreview(lines)}
                      </p>
                    </div>
                    <p className="shrink-0 text-lg font-semibold tabular-nums text-site-fg">
                      {formatUsd(order.totalUsd ?? 0)}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <OrderDetailDialog
        open={Boolean(selectedOrderId)}
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        demoMode={isDemo}
      />
    </>
  );
}
