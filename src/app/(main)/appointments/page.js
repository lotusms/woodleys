import PageLayout from "@/components/PageLayout";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { orgLocation, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Contact us"),
  description:
    "Request a private appointment at Woodley's Jewelers in Beaumont, California for engagement selections, custom design, repairs, and more.",
};

export default function AppointmentsPage() {
  return (
    <PageLayout
      eyebrow="Visit"
      title="Contact us"
      subtitle={`Schedule time with our team in ${orgLocation}. We keep the process simple, unhurried, and focused on what you need.`}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="space-y-5 text-site-secondary">
          <p>
            Whether you are choosing an engagement ring, beginning a custom
            design, or bringing in a piece for repair, an appointment ensures
            we can give you our full attention.
          </p>
          <p>
            Complete the form and your email client will open with your details
            ready to send. We will follow up to confirm a time that works for
            you.
          </p>
        </div>
        <AppointmentForm />
      </div>
    </PageLayout>
  );
}
