import { useEffect } from "react";

/**
 * Marks elements outside an overlay as inert while active (WCAG 2.4.3).
 *
 * @param {boolean} active
 * @param {string[]} targetIds element ids to inert
 */
export function useInertWhen(active, targetIds) {
  useEffect(() => {
    const elements = targetIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (active) {
      elements.forEach((el) => {
        el.inert = true;
      });
    } else {
      elements.forEach((el) => {
        el.inert = false;
      });
    }

    return () => {
      elements.forEach((el) => {
        el.inert = false;
      });
    };
  }, [active, targetIds]);
}
