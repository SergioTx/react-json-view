import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
export function required<Value>(value: Value | null | undefined): Value {
  if (value === null || value === undefined)
    throw new Error("Expected test value to exist");
  return value;
}
