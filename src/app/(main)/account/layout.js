import AccountAuthGate from "@/components/account/AccountAuthGate";
import MemberAccountLayout from "@/components/account/MemberAccountLayout";
import { sitePageTitle } from "@/config";
import { Suspense } from "react";

export const metadata = {
  title: sitePageTitle("My Account"),
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }) {
  return (
    <Suspense fallback={<p className="text-sm text-site-secondary">Loading…</p>}>
      <AccountAuthGate>
        <MemberAccountLayout>{children}</MemberAccountLayout>
      </AccountAuthGate>
    </Suspense>
  );
}
