import Link from "next/link";
import InnerPageBackdrop from "@/components/InnerPageBackdrop";

/**
 * Editorial catalog layout — full-bleed hero, classic typography, modern spacing.
 *
 * @param {{
 *   eyebrow?: string;
 *   title: string;
 *   subtitle?: string;
 *   heroImage?: { src: string; alt: string };
 *   breadcrumbs?: { label: string; href?: string }[];
 *   actions?: React.ReactNode;
 *   children: React.ReactNode;
 * }} props
 */
export default function CategoryPageLayout({
  eyebrow,
  title,
  subtitle,
  heroImage,
  breadcrumbs = [],
  actions = null,
  children,
}) {
  return (
    <div className="relative z-10 w-full min-w-0">
      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        <div className="relative min-h-[min(72vh,36rem)] w-full overflow-hidden bg-champagne sm:min-h-[min(68vh,40rem)]">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-br from-champagne via-ivory to-stone-200/40"
              aria-hidden
            />
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/25 to-stone-950/5"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-stone-950/35 via-transparent to-transparent"
            aria-hidden
          />

          <div className="relative z-10 mx-auto flex min-h-[min(72vh,36rem)] max-w-7xl flex-col justify-end px-6 pb-10 pt-28 sm:min-h-[min(68vh,40rem)] sm:px-10 sm:pb-12 lg:px-12">
            {breadcrumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-white/65">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                      {index > 0 ? (
                        <span className="text-white/35" aria-hidden>
                          /
                        </span>
                      ) : null}
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="transition hover:text-white"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-white/90">{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            {eyebrow ? (
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-white/75">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-medium tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/82 sm:text-lg sm:leading-8">
                {subtitle}
              </p>
            ) : null}

            {actions ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
            ) : null}
          </div>
        </div>
      </section>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-2 opacity-[0.03] mix-blend-multiply fabric-texture"
      />
      <InnerPageBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-14 sm:px-10 lg:px-12">
        {children}
      </div>
    </div>
  );
}
