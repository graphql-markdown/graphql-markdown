import { afterEach } from "vitest";

/**
 * Vitest has no `vi.replaceProperty()` equivalent, so this helper reproduces
 * the Jest semantics the migrated tests rely on: the property is swapped for
 * the duration of the test and the original descriptor is put back afterwards.
 */
const restorers: (() => void)[] = [];

export const replaceProperty = <T extends object, K extends keyof T>(
  target: T,
  property: K,
  value: T[K],
): void => {
  const hasOwn = Object.prototype.hasOwnProperty.call(target, property);
  const descriptor = Object.getOwnPropertyDescriptor(target, property);

  restorers.push((): void => {
    if (hasOwn && descriptor) {
      Object.defineProperty(target, property, descriptor);
    } else {
      delete target[property];
    }
  });

  Object.defineProperty(target, property, {
    configurable: true,
    enumerable: descriptor?.enumerable ?? true,
    value,
    writable: true,
  });
};

afterEach((): void => {
  while (restorers.length > 0) {
    restorers.pop()!();
  }
});
