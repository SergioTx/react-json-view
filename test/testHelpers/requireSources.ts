import register from "ignore-styles";
import "./../../src/js/index";
import { cleanup } from "@testing-library/react";
import jsdom from "jsdom";
register([".sass", ".scss"]);
function setUpDomEnvironment() {
  const { JSDOM } = jsdom;
  const dom = new JSDOM("<!doctype html><html><body></body></html>");
  const { window } = dom;
  Object.defineProperty(globalThis, "window", {
    value: window,
    configurable: true,
    writable: true,
  });
  global.document = window.document;
  Object.defineProperty(global, "navigator", {
    value: {
      userAgent: "node.js",
    },
    writable: true,
  });
  copyProps(window, global);
}
function copyProps(src: object, target: object): void {
  for (const property of Object.getOwnPropertyNames(src)) {
    if (Reflect.get(target, property) !== undefined) continue;
    const descriptor = Object.getOwnPropertyDescriptor(src, property);
    if (descriptor) Object.defineProperty(target, property, descriptor);
  }
}
setUpDomEnvironment();
export function required<Value>(value: Value | null | undefined): Value {
  if (value === null || value === undefined)
    throw new Error("Expected test value to exist");
  return value;
}
export const mochaHooks = {
  afterEach() {
    cleanup();
  },
};
