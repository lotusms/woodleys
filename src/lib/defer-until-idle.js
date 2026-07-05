/**
 * Run work after the browser is idle so it stays off the LCP critical path.
 *
 * @param {() => void} callback
 * @param {{ timeout?: number }} [options]
 * @returns {() => void} cancel
 */
export function deferUntilIdle(callback, { timeout = 2500 } = {}) {
  if (typeof window === "undefined") {
    return () => {};
  }

  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, 1);
  return () => window.clearTimeout(id);
}
