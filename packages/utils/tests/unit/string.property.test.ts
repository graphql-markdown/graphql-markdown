// packages/utils/tests/unit/string.property.test.ts
import * as fc from "fast-check";

import {
  capitalize,
  escapeMDX,
  firstUppercase,
  kebabCase,
  prune,
  replaceDiacritics,
  slugify,
  startCase,
} from "../../src/string";

describe("string (property-based)", () => {
  test("slugify() output only contains lowercase alphanum and single inner dashes", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(fc.string({ unit: "binary" }), (str) => {
        expect(slugify(str)).toMatch(/^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
      }),
    );
  });

  test("kebabCase() is idempotent", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(fc.string({ unit: "binary" }), (str) => {
        expect(kebabCase(kebabCase(str))).toBe(kebabCase(str));
      }),
    );
  });

  test("startCase() is idempotent on ASCII input", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(fc.string({ unit: "grapheme-ascii" }), (str) => {
        expect(startCase(startCase(str))).toBe(startCase(str));
      }),
    );
  });

  test("capitalize() is idempotent and firstUppercase() preserves length of ASCII input", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(fc.string({ unit: "grapheme-ascii" }), (str) => {
        expect(capitalize(capitalize(str))).toBe(capitalize(str));
        expect(firstUppercase(str)).toHaveLength(str.length);
      }),
    );
  });

  test("replaceDiacritics() is idempotent and leaves no combining marks", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(fc.string({ unit: "binary" }), (str) => {
        const once = replaceDiacritics(str);
        expect(replaceDiacritics(once)).toBe(once);
        expect(once).not.toMatch(/[̀-ͯ]/);
      }),
    );
  });

  test("prune() strips exactly one wrapping substr from each side", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(fc.string({ minLength: 1 }), fc.string(), (substr, core) => {
        expect(prune(`${substr}${core}${substr}`, substr)).toBe(core);
      }),
    );
  });

  test("escapeMDX() output has no raw MDX specials when no backtick is present", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(
        fc.string().filter((s) => {
          return !s.includes("`");
        }),
        (str) => {
          expect(escapeMDX(str)).not.toMatch(/[{}<>_*]/);
        },
      ),
    );
  });

  test("escapeMDX() leaves strings without MDX specials unchanged", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(
        fc.string().filter((s) => {
          return !/[{}<>_*]/.test(s);
        }),
        (str) => {
          expect(escapeMDX(str)).toBe(str);
        },
      ),
    );
  });
});
