import AccountAuthGate from "@/components/account/AccountAuthGate";
import MemberAccountLayout from "@/components/account/MemberAccountLayout";
import { sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("My Account"),
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }) {
  return (
    <AccountAuthGate>
      <MemberAccountLayout>{children}</MemberAccountLayout>
    </AccountAuthGate>
  );
}
