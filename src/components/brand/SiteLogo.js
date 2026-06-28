import Link from "next/link";
import Image from "next/image";
import { orgName, orgEstablished } from "@/config";

/**
 * Text logotype until final logo artwork is supplied.
 * Uses Playfair Display — swap for `<Image>` when logo file is available.
 */
export default function SiteLogo({
  className = "",
  variant = "default",
  link = true,
}) {
  const isCompact = variant === "compact";
  const isFooter = variant === "footer";

  const content = (
    <span
      className={`inline-flex flex-col ${isCompact ? "gap-0" : "gap-0.5"} ${className}`}
    >
      <span
        className={`font-serif leading-none tracking-[-0.02em] text-site-fg ${
          isCompact
            ? "text-lg sm:text-xl"
            : isFooter
              ? "text-xl sm:text-2xl"
              : "text-xl sm:text-2xl lg:text-[1.65rem]"
        }`}
      >
        Woodley&apos;s
      </span>
      {!isCompact ? (
        <span
          className={`font-sans uppercase tracking-[0.28em] text-site-secondary ${
            isFooter ? "text-[0.6rem]" : "text-[0.58rem] sm:text-[0.62rem]"
          }`}
        >
          Jewelers
        </span>
      ) : null}
      {isFooter ? (
        <span className="mt-2 font-sans text-xs tracking-wide text-site-secondary">
          Est. {orgEstablished}
        </span>
      ) : null}
    </span>
  );

  if (!link) return content;

  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center focus-visible:outline-offset-4"
      aria-label={`${orgName} home`}
    >
      {content}
    </Link>
  );
}

/** Favicon-sized mark — replace src when logo SVG is available. */
export function SiteLogoMark({ size = 32, className = "" }) {
  return (
    <Image
      src="/images/logo-mark.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
      priority
    />
  );
}
