import '@testing-library/jest-dom';

const mockRect = {
  width: 100,
  height: 20,
  top: 0,
  left: 0,
  bottom: 20,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => {},
};

Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
  configurable: true,
  value: () => mockRect,
});

Object.defineProperty(HTMLElement.prototype, "offsetParent", {
  configurable: true,
  get() {
    return document.body;
  },
});
