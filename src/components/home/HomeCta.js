import PrimaryButton from "@/components/ui/PrimaryButton";

export default function HomeCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 lg:px-12">
      <div className="rounded-sm border border-stone-200/80 bg-champagne/50 px-8 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="font-serif text-3xl font-medium text-site-fg sm:text-4xl">
          Visit us in Beaumont
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-site-secondary">
          Schedule a private appointment for engagement selections, custom design,
          repairs, or a quiet browse of our collections.
        </p>
        <PrimaryButton href="/appointments" className="mt-8">
          Request an appointment
        </PrimaryButton>
      </div>
    </section>
  );
}
