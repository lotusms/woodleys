import dynamic from "next/dynamic";
import PageLayout from "@/components/PageLayout";
import {
  ContactPageContactBand,
  ContactPageHero,
} from "@/components/contact/ContactPageAside";
import { orgLocation, sitePageTitle } from "@/config";

const AppointmentForm = dynamic(
  () => import("@/components/appointments/AppointmentForm"),
  {
    loading: () => (
      <div
        className="h-[28rem] animate-pulse rounded-sm border border-stone-200/70 bg-stone-100/60"
        aria-hidden
      />
    ),
  },
);

export const metadata = {
  title: sitePageTitle("Contact us"),
  description:
    "Request a private appointment at Woodley's Jewelers in Beaumont, California for engagement selections, custom design, repairs, and more.",
};

export default function ContactPage() {
  return (
    <>
      <PageLayout
        eyebrow="Visit"
        title="Contact us"
        subtitle={`Schedule a private appointment in ${orgLocation} for engagement selections, custom design, repairs, and more. Share your details below and we will follow up personally to confirm a time.`}
        subtitleClassName="text-base leading-relaxed text-site-secondary sm:text-[1.05rem]"
        containerClassName="pb-0"
      >
        <div className="mb-10">
          <AppointmentForm />
        </div>
      </PageLayout>
      <ContactPageContactBand />
      <ContactPageHero />
    </>
  );
}
