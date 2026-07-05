import { Suspense } from "react";
import RouteTransitionBar from "@/components/navigation/RouteTransitionBar";

export default function RouteTransitionProvider() {
  return (
    <Suspense fallback={null}>
      <RouteTransitionBar />
    </Suspense>
  );
}
