import "@testing-library/jest-dom/vitest";

if (typeof window !== "undefined") {
  window.scrollTo = () => {};

  if (typeof window.matchMedia === "undefined") {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
}

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
}
