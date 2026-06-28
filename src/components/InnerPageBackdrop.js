import { orgName } from "@/config";

export default function InnerPageBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-champagne/30 via-transparent to-ivory"
    />
  );
}
