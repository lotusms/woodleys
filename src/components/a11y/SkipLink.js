/**
 * Skip to main content — first focusable control for keyboard users.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-site-fg focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
    >
      Skip to main content
    </a>
  );
}
