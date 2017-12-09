// inlined version of https://github.com/sindresorhus/dom-loaded/blob/master/index.js
export function waitDOMReady() {
  return new Promise(resolve => {
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      resolve();
    } else {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          resolve();
        },
        {
          capture: true,
          once: true,
          passive: true
        }
      );
    }
  });
}
