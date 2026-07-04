import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab / Shift+Tab within a container while active (e.g. modal, mobile nav).
 *
 * @param {React.RefObject<HTMLElement | null>} containerRef
 * @param {boolean} active
 * @param {{ initialFocus?: "first" | "container"; returnFocusRef?: React.RefObject<HTMLElement | null>; externalFocusRefs?: React.RefObject<HTMLElement | null>[] }} [options]
 */
export function useFocusTrap(containerRef, active, options = {}) {
  const { initialFocus = "first", returnFocusRef, externalFocusRefs = [] } = options;

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement;

    const getFocusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el instanceof HTMLElement && el.offsetParent !== null,
      );

    if (initialFocus === "first") {
      const focusable = getFocusable();
      focusable[0]?.focus();
    } else {
      container.focus();
    }

    function handleKeyDown(event) {
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey) {
        if (current === first || current === container) {
          event.preventDefault();
          last.focus();
        }
      } else if (current === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function isAllowedOutside(target) {
      return externalFocusRefs.some((ref) => {
        const el = ref?.current;
        return el instanceof HTMLElement && (el === target || el.contains(target));
      });
    }

    function handleFocusIn(event) {
      const target = event.target;
      if (!(target instanceof Node) || container.contains(target)) return;
      if (isAllowedOutside(target)) return;

      const focusable = getFocusable();
      focusable[0]?.focus();
    }

    container.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      const returnTarget = returnFocusRef?.current;
      if (returnTarget instanceof HTMLElement) {
        returnTarget.focus();
      } else if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, initialFocus, returnFocusRef, externalFocusRefs]);
}
