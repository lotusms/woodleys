import Link from "next/link";
import Image from "next/image";
import { orgName, orgEstablished } from "@/config";

const LOGO_SRC = "/images/Woodley's Jewelers_Logo.svg";
const LOGO_WIDTH = 254;
const LOGO_HEIGHT = 92;

/** Id for the primary header logo link — initial keyboard focus target on every page. */
export const SITE_LOGO_ID = "site-logo";

const logoHeights = {
  default: "h-9 w-auto sm:h-10 lg:h-11",
  compact: "h-8 w-auto sm:h-9",
  footer: "h-10 w-auto sm:h-11",
};

/**
 * @param {{
 *   className?: string;
 *   variant?: "default" | "compact" | "footer";
 *   link?: boolean;
 * }} props
 */
export default function SiteLogo({
  className = "",
  variant = "default",
  link = true,
}) {
  const isFooter = variant === "footer";

  const content = (
    <span className={`inline-flex flex-col gap-2 ${className}`}>
      <Image
        src={LOGO_SRC}
        alt={link ? "" : orgName}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={logoHeights[variant] ?? logoHeights.default}
        priority={variant === "default"}
      />
      {isFooter ? (
        <span className="font-sans text-xs tracking-wide text-site-secondary">
          Est. {orgEstablished}
        </span>
      ) : null}
    </span>
  );

  if (!link) return content;

  return (
    <Link
      id={SITE_LOGO_ID}
      href="/"
      className="group inline-flex shrink-0 items-center focus-visible:outline-offset-4"
      aria-label={`${orgName} home`}
    >
      {content}
    </Link>
  );
}

/** Full brand logo at a custom height — native img so SVG art is never cropped. */
export function SiteLogoImage({ height = 44, className = "", link = false }) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt=""
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={`block h-auto w-auto max-w-none object-contain ${className}`}
      style={{ height, width: "auto" }}
      aria-hidden
    />
  );

  if (link) {
    return (
      <Link
        href="/"
        className="inline-flex shrink-0 focus-visible:outline-offset-4"
        aria-label={`${orgName} home`}
      >
        {image}
      </Link>
    );
  }

  return image;
}

/** Favicon-sized mark. */
export function SiteLogoMark({ size = 32, className = "" }) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={`h-auto w-auto ${className}`}
      style={{ width: size * (LOGO_WIDTH / LOGO_HEIGHT), height: size }}
      aria-hidden
      priority
    />
  );
}
