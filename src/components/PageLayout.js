import InnerPageBackdrop from "@/components/InnerPageBackdrop";

export default function PageLayout({
  eyebrow,
  title,
  subtitle,
  children,
  width: _width = "default",
  buttonArea = null,
  heroImage = null,
}) {
  const layoutWidth = "max-w-7xl";

  return (
    <main className="relative z-10 w-full min-w-0 pt-[4.5rem] xl:pt-[7.5rem]">
      {heroImage ? (
        <div className="relative mx-auto mb-10 max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="relative aspect-[21/9] overflow-hidden rounded-sm bg-champagne">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="h-full w-full object-cover"
            />
            <div className="product-image-scrim-inner" aria-hidden />
          </div>
        </div>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-2 opacity-[0.03] mix-blend-multiply fabric-texture"
      />
      <InnerPageBackdrop />
      <div
        className={`relative z-10 mx-auto w-full px-6 pb-28 pt-12 sm:px-10 lg:px-12 ${layoutWidth}`}
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {title}
            </h1>
          </div>
          {buttonArea ? <div>{buttonArea}</div> : null}
        </div>
        {subtitle ? (
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-site-secondary sm:text-xl">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-10 space-y-6 text-base leading-8 text-site-fg/90 sm:space-y-8 sm:text-[1.05rem] sm:leading-9">
          {children}
        </div>
      </div>
    </main>
  );
}
