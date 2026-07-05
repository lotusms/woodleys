import InnerPageBackdrop from "@/components/InnerPageBackdrop";
import { sitePageInsetContainerClass } from "@/config";

export default function PageLayout({
  eyebrow,
  title,
  subtitle,
  subtitleClassName = "text-lg leading-relaxed text-site-secondary sm:text-xl",
  containerClassName = "",
  children,
  width: _width = "default",
  buttonArea = null,
  heroImage = null,
}) {
  return (
    <div className="relative z-10 w-full min-w-0">
      {heroImage ? (
        <div className={`relative mb-10 ${sitePageInsetContainerClass}`}>
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
        className={`relative z-10 pb-28 pt-12 ${sitePageInsetContainerClass} ${containerClassName}`}
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
          <p className={`mt-4 max-w-2xl ${subtitleClassName}`}>{subtitle}</p>
        ) : null}
        <div className="mt-10 flex flex-col gap-6 text-base text-site-fg/90 sm:gap-8 sm:text-[1.05rem]">
          {children}
        </div>
      </div>
    </div>
  );
}
