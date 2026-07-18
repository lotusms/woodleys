import Link from "next/link";
import Image from "next/image";
import { orgName, orgEstablished } from "@/config";

/** Horizontal wordmark — header / compact chrome. */
const LOGO_HORIZONTAL_SRC = "/images/Woodley's Jewelers_Logo.svg";
const LOGO_HORIZONTAL_WIDTH = 254;
const LOGO_HORIZONTAL_HEIGHT = 92;

/** Stacked wordmark — footer, showroom CTA, receipts. */
const LOGO_STACK_SRC = "/images/Woodley Logo Stack.svg";
const LOGO_STACK_LIGHT_SRC = "/images/Woodley Logo Stack Light.svg";
const LOGO_STACK_WIDTH = 107;
const LOGO_STACK_HEIGHT = 126;

/** Id for the primary header logo link — initial keyboard focus target on every page. */
export const SITE_LOGO_ID = "site-logo";

const logoHeights = {
  default: "h-9 w-auto sm:h-10 lg:h-11",
  compact: "h-8 w-auto sm:h-9",
  footer: "h-20 w-auto sm:h-24",
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
  const src = isFooter ? LOGO_STACK_SRC : LOGO_HORIZONTAL_SRC;
  const width = isFooter ? LOGO_STACK_WIDTH : LOGO_HORIZONTAL_WIDTH;
  const height = isFooter ? LOGO_STACK_HEIGHT : LOGO_HORIZONTAL_HEIGHT;

  const content = (
    <span className={`inline-flex flex-col gap-2 ${className}`}>
      <Image
        src={src}
        alt={link ? "" : orgName}
        width={width}
        height={height}
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
export function SiteLogoImage({
  height = 56,
  className = "",
  link = false,
  tone = "default",
}) {
  const src = tone === "light" ? LOGO_STACK_LIGHT_SRC : LOGO_STACK_SRC;
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={LOGO_STACK_WIDTH}
      height={LOGO_STACK_HEIGHT}
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

/** Favicon-sized mark — uses the horizontal lockup for consistency with the header. */
export function SiteLogoMark({ size = 32, className = "" }) {
  return (
    <Image
      src={LOGO_HORIZONTAL_SRC}
      alt=""
      width={LOGO_HORIZONTAL_WIDTH}
      height={LOGO_HORIZONTAL_HEIGHT}
      className={`h-auto w-auto ${className}`}
      style={{
        width: size * (LOGO_HORIZONTAL_WIDTH / LOGO_HORIZONTAL_HEIGHT),
        height: size,
      }}
      aria-hidden
      priority
    />
  );
}
