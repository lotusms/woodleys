"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { deferUntilIdle } from "@/lib/defer-until-idle";

const HomeHero = dynamic(() => import("@/components/home/HomeHero"), { ssr: false });

/** Loads the interactive hero carousel after the main thread is idle. */
export default function HomeHeroClientGate() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    return deferUntilIdle(() => setLoad(true), { timeout: 4000 });
  }, []);

  if (!load) return null;
  return (
    <div className="absolute inset-x-0 top-0 z-[1]">
      <HomeHero />
    </div>
  );
}
