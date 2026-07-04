/**
 * Primary page landmark — target for route-change announcements and programmatic focus.
 *
 * @param {{ children: React.ReactNode; className?: string; id?: string }} props
 */
export default function MainContent({
  children,
  className = "",
  id = "main-content",
}) {
  return (
    <main id={id} tabIndex={-1} className={className}>
      {children}
    </main>
  );
}
