import { Suspense } from "react";
import MemberOrdersPage from "@/components/account/MemberOrdersPage";

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-site-secondary">Loading…</p>}>
      <MemberOrdersPage />
    </Suspense>
  );
}
