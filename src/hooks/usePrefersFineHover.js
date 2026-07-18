"use client";

import { useEffect, useState } from "react";

/**
 * True when the primary input can meaningfully hover (mouse / trackpad),
 * not touch or coarse pointers. Used to enable hover menus without breaking
 * keyboard or touch navigation.
 */
export function usePrefersFineHover() {
  const [prefersFineHover, setPrefersFineHover] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setPrefersFineHover(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return prefersFineHover;
}
