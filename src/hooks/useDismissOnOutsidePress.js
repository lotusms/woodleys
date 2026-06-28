import { useEffect } from "react";

/**
 * Closes a floating panel when the user presses outside its container elements.
 * Headless UI Popover’s built-in outside-click can miss portalled panels on
 * pages with multiple top-level roots; this hook only checks the given refs.
 *
 * @param {boolean} enabled
 * @param {() => void} onDismiss
 * @param {Array<import("react").RefObject<HTMLElement | null>>} containerRefs
 */
export function useDismissOnOutsidePress(enabled, onDismiss, containerRefs) {
  useEffect(() => {
    if (!enabled) return;

    function isInside(target) {
      if (!(target instanceof Node)) return false;
      return containerRefs.some((ref) => {
        const el = ref.current;
        return Boolean(el && el.contains(target));
      });
    }

    function onPointerDown(event) {
      if (isInside(event.target)) return;
      onDismiss();
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [enabled, onDismiss, containerRefs]);
}
