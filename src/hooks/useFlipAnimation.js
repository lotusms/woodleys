import { useCallback, useLayoutEffect, useRef } from "react";

const FLIP_DURATION_MS = 520;
const FLIP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * FLIP animation for list reordering — animates items to new grid positions.
 *
 * @param {string} orderKey — changes when item order should animate (e.g. sorted ids joined)
 */
export function useFlipAnimation(orderKey) {
  const rectsRef = useRef(new Map());
  const nodesRef = useRef(new Map());
  const skipRef = useRef(true);

  const setNodeRef = useCallback((id) => {
    return (node) => {
      if (node) nodesRef.current.set(id, node);
      else nodesRef.current.delete(id);
    };
  }, []);

  useLayoutEffect(() => {
    const nodes = nodesRef.current;
    const nextRects = new Map();

    nodes.forEach((node, id) => {
      nextRects.set(id, node.getBoundingClientRect());
    });

    if (!skipRef.current) {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduceMotion) {
        nodes.forEach((node, id) => {
          const prev = rectsRef.current.get(id);
          const next = nextRects.get(id);
          if (!prev || !next) return;

          const dx = prev.left - next.left;
          const dy = prev.top - next.top;
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

          node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          node.style.transition = "transform 0s";
          node.style.willChange = "transform";
          node.style.zIndex = "1";

          requestAnimationFrame(() => {
            node.style.transition = `transform ${FLIP_DURATION_MS}ms ${FLIP_EASING}`;
            node.style.transform = "";
          });

          const onEnd = (event) => {
            if (event.propertyName !== "transform") return;
            node.style.transition = "";
            node.style.willChange = "";
            node.style.zIndex = "";
            node.removeEventListener("transitionend", onEnd);
          };
          node.addEventListener("transitionend", onEnd);
        });
      }
    }

    rectsRef.current = nextRects;
    skipRef.current = false;
  }, [orderKey]);

  return setNodeRef;
}
