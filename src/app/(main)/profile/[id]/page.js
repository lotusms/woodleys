import { notFound } from "next/navigation";
import MemberProfilePage from "@/components/account/MemberProfilePage";
import {
  getSampleProfileById,
  getSampleProfileIds,
} from "@/lib/profile-sample-data";
import { DEMO_PROFILE_ID } from "@/lib/orders-sample-data";
import { sitePageTitle } from "@/config";

export function generateStaticParams() {
  return getSampleProfileIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const profile = getSampleProfileById(id);
  if (!profile) return {};
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  return {
    title: sitePageTitle(name ? `${name}'s profile` : "Profile"),
    robots: { index: false, follow: false },
  };
}

export default async function DemoProfilePage({ params }) {
  const { id } = await params;
  const profile = getSampleProfileById(id);
  if (!profile) notFound();

  return (
    <MemberProfilePage
      sampleProfile={profile}
      returnTo={`/profile/${id}`}
      demoProfileId={id === DEMO_PROFILE_ID ? DEMO_PROFILE_ID : undefined}
    />
  );
}
