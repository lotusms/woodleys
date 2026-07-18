import Link from "next/link";
import { RiFacebookFill, RiInstagramLine } from "react-icons/ri";
import SiteLogo from "@/components/brand/SiteLogo";
import {
  orgLocation,
  orgEstablished,
  orgPhone,
  orgEmail,
  orgSocialLinks,
} from "@/config";
import { footerPageLinks, mainNav } from "@/config";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  {
    href: "mailto:info@lotusmarketingsolutions.com",
    label: "Technical Support",
    external: true,
  },
];

const socialIcons = {
  Facebook: RiFacebookFill,
  Instagram: RiInstagramLine,
};

export default function SiteFooter() {
  return (
    <footer
      id="site-footer"
      className="relative z-10 mt-auto w-full border-t border-stone-200/80 bg-champagne/40 py-16"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr] lg:px-12">
        <div>
          <SiteLogo variant="footer" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-site-secondary">
            A family-owned fine jeweler in {orgLocation}, trusted since{" "}
            {orgEstablished}. Engagement rings, diamonds, custom design, watches,
            and expert care, presented with a quiet confidence in {orgLocation}.
          </p>
        </div>

        <div>
          <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-site-secondary">
            Visit
          </h2>
          <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed text-site-fg">
            <p>{orgLocation}</p>
            <p>
              <a
                href={`tel:${orgPhone.replace(/\D/g, "")}`}
                className="transition hover:text-warm-gold-dark"
              >
                {orgPhone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${orgEmail}`}
                className="transition hover:text-warm-gold-dark"
              >
                {orgEmail}
              </a>
            </p>
          </address>
          <nav aria-label="Social networks" className="mt-5 flex items-center gap-3">
            {orgSocialLinks.map((item) => {
              const Icon = socialIcons[item.label];
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center text-site-fg transition hover:text-warm-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2"
                  aria-label={item.label}
                >
                  {Icon ? <Icon className="h-5 w-5" aria-hidden /> : item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div>
          <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-site-secondary">
            Other links
          </h2>
          <nav aria-label="Other links" className="mt-4 flex flex-col gap-2">
            {footerPageLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-site-fg transition hover:text-warm-gold-dark"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-site-secondary">
            Collections
          </h2>
          <nav aria-label="Footer collections" className="mt-4">
            <ul className="grid gap-2 sm:grid-cols-2" role="list">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-site-fg transition hover:text-warm-gold-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-stone-200/70 px-6 pt-8 sm:flex-row sm:px-10 lg:px-12">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-site-secondary">
          © {new Date().getFullYear()}{" "}Woodley&apos;s Jewelers
        </p>
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-6">
          {legalLinks.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-site-secondary transition hover:text-site-fg"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-site-secondary transition hover:text-site-fg"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
