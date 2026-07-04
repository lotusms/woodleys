import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageLayout from "@/components/PageLayout";
import MemberOrdersPage from "@/components/account/MemberOrdersPage";
import { DEMO_PROFILE_ID } from "@/lib/orders-sample-data";
import {
  getSampleProfileById,
  getSampleProfileIds,
} from "@/lib/profile-sample-data";
import { sitePageTitle } from "@/config";

export function generateStaticParams() {
  return getSampleProfileIds()
    .filter((id) => id === DEMO_PROFILE_ID)
    .map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const profile = getSampleProfileById(id);
  if (!profile) return {};
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  return {
    title: sitePageTitle(name ? `${name}'s orders` : "Orders"),
    robots: { index: false, follow: false },
  };
}

export default async function DemoProfileOrdersPage({ params }) {
  const { id } = await params;
  const profile = getSampleProfileById(id);
  if (!profile || id !== DEMO_PROFILE_ID) notFound();

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  return (
    <PageLayout
      eyebrow="Member profile"
      title={name ? `${name}'s orders` : "Orders"}
      subtitle="Sample order history for demo and review."
    >
      <Suspense fallback={<p className="text-sm text-site-secondary">Loading…</p>}>
        <MemberOrdersPage demoProfileId={id} />
      </Suspense>
    </PageLayout>
  );
}
