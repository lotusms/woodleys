import Link from "next/link";
import { RiArrowRightLine, RiMapPinLine, RiPencilLine, RiUser3Line } from "react-icons/ri";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import Card from "@/components/ui/Card";
import { formatUsd } from "@/lib/money";
import {
  formatUserAddressBlock,
  formatUserPhoneDisplay,
} from "@/lib/user-account-address";
import { EMPTY_VALUE_LABEL } from "@/lib/prose";

/**
 * @typedef {{
 *   id?: string;
 *   firstName?: string;
 *   lastName?: string;
 *   email?: string;
 *   phone?: string;
 *   shippingAddress?: Record<string, string | undefined> | null;
 *   billingAddress?: Record<string, string | undefined> | null;
 *   billingSameAsShipping?: boolean;
 *   memberSince?: string;
 *   orderCount?: number;
 *   recentOrders?: Array<{ id: string; createdAt?: string; totalUsd?: number; status?: string }>;
 * }} MemberProfile
 */

/**
 * @param {string | undefined} iso
 */
function formatMemberSince(iso) {
  if (!iso) return EMPTY_VALUE_LABEL;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return EMPTY_VALUE_LABEL;
    return d.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return EMPTY_VALUE_LABEL;
  }
}

/**
 * @param {{
 *   profile: MemberProfile;
 *   ordersHref?: string | null;
 *   orderDetailBasePath?: string | null;
 *   editable?: boolean;
 *   showPasswordForm?: boolean;
 *   showPasswordPrompt?: boolean;
 *   onEditPersonal?: () => void;
 *   onEditShipping?: () => void;
 *   onEditBilling?: () => void;
 *   onEditPassword?: () => void;
 * }} props
 */
export default function MemberProfileView({
  profile,
  ordersHref = "/account/orders",
  orderDetailBasePath,
  editable = false,
  showPasswordForm = false,
  showPasswordPrompt = false,
  onEditPersonal,
  onEditShipping,
  onEditBilling,
  onEditPassword,
}) {
  const displayName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const shippingText = formatUserAddressBlock(profile.shippingAddress);
  const billingText = profile.billingSameAsShipping
    ? "Same as shipping address"
    : formatUserAddressBlock(profile.billingAddress);
  const phoneText = formatUserPhoneDisplay(profile.phone);
  const recentOrders = Array.isArray(profile.recentOrders)
    ? profile.recentOrders
    : [];
  const orderCount = profile.orderCount ?? recentOrders.length;
  const showOrdersLink = Boolean(ordersHref) && orderCount > 0;
  const hasPasswordSection = showPasswordForm || showPasswordPrompt;

  function SectionHeader({ title, onEdit }) {
    return (
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-warm-gold-dark">
          {title}
        </p>
        {editable && onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-stone-200/90 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-warm-gold-dark shadow-sm transition hover:border-warm-gold/40 hover:bg-white hover:text-site-fg"
          >
            <RiPencilLine className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-2">
        <Card variant="inset" className="!pt-6">
          <SectionHeader title="Personal information" onEdit={onEditPersonal} />
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary">
                Name
              </dt>
              <dd className="mt-1 text-base text-site-fg">
                {displayName || EMPTY_VALUE_LABEL}
              </dd>
            </div>
            <div>
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary">
                Email
              </dt>
              <dd className="mt-1 break-all text-base text-site-fg">
                {profile.email || EMPTY_VALUE_LABEL}
              </dd>
            </div>
            <div>
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary">
                Phone
              </dt>
              <dd className="mt-1 text-base text-site-fg">{phoneText}</dd>
            </div>
            <div>
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary">
                Member since
              </dt>
              <dd className="mt-1 text-base text-site-fg">
                {formatMemberSince(profile.memberSince)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card variant="inset" title="Account summary" titleTag="h2">
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-champagne/40 p-4">
              <RiUser3Line className="mt-0.5 h-5 w-5 text-warm-gold-dark" aria-hidden />
              <div>
                <p className="text-sm font-medium text-site-fg">Registered member</p>
                <p className="mt-1 text-sm leading-relaxed text-site-secondary">
                  Profile saved for faster checkout and order history.
                </p>
              </div>
            </div>
            <p className="text-sm text-site-secondary">
              <span className="font-semibold text-site-fg">{orderCount}</span>{" "}
              order{orderCount === 1 ? "" : "s"} on file
            </p>
            {showOrdersLink ? (
              <Link
                href={ordersHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-warm-gold-dark transition hover:text-site-fg"
              >
                View all orders
                <RiArrowRightLine className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </Card>
      </section>

      <section
        className={`grid gap-5 lg:items-start ${hasPasswordSection ? "lg:grid-cols-2" : ""}`}
      >
        <div
          className={`flex flex-col gap-5 ${hasPasswordSection ? "" : "lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-5"}`}
        >
          <Card variant="inset" className="!pt-6">
            <SectionHeader title="Shipping address" onEdit={onEditShipping} />
            <div className="flex gap-3">
              <RiMapPinLine className="mt-0.5 h-5 w-5 shrink-0 text-warm-gold-dark" aria-hidden />
              <p className="whitespace-pre-line text-sm leading-relaxed text-site-fg">
                {shippingText}
              </p>
            </div>
          </Card>

          <Card variant="inset" className="!pt-6">
            <SectionHeader title="Billing address" onEdit={onEditBilling} />
            <div className="flex gap-3">
              <RiMapPinLine className="mt-0.5 h-5 w-5 shrink-0 text-warm-gold-dark" aria-hidden />
              <p className="whitespace-pre-line text-sm leading-relaxed text-site-fg">
                {billingText}
              </p>
            </div>
          </Card>
        </div>

        {showPasswordForm ? (
          <Card variant="inset" className="!pt-6">
            <SectionHeader title="Password" onEdit={undefined} />
            <p className="text-sm leading-relaxed text-site-secondary">
              Update your sign-in password. Changes sync with Firebase Auth so you can
              sign in with the new password right away.
            </p>
            <div className="mt-6 max-w-md">
              <ChangePasswordForm embedded />
            </div>
          </Card>
        ) : showPasswordPrompt ? (
          <Card variant="inset" className="!pt-6">
            <SectionHeader title="Password" onEdit={onEditPassword} />
            <p className="text-sm leading-relaxed text-site-secondary">
              Sign in to change your password. Updates sync with Firebase Auth.
            </p>
          </Card>
        ) : null}
      </section>

      {recentOrders.length > 0 ? (
        <Card variant="inset" title="Recent orders" titleTag="h2">
          <ul className="mt-4 divide-y divide-stone-200/80">
            {recentOrders.map((order) => {
              const detailHref =
                orderDetailBasePath && order.id
                  ? `${orderDetailBasePath}/${encodeURIComponent(order.id)}`
                  : null;

              return (
                <li
                  key={order.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-mono text-sm text-site-fg">{order.id}</p>
                    <p className="mt-1 text-sm text-site-secondary">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : EMPTY_VALUE_LABEL}
                      {order.status ? ` · ${order.status}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="tabular-nums text-sm font-semibold text-site-fg">
                      {formatUsd(Number(order.totalUsd ?? 0))}
                    </p>
                    {detailHref ? (
                      <Link
                        href={detailHref}
                        className="text-sm font-semibold text-warm-gold-dark hover:text-site-fg"
                      >
                        Details
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
