import { orgName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Thank you"),
  description: `Your order confirmation from ${orgName}.`,
};

export default function ServicesThankYouLayout({ children }) {
  return children;
}
