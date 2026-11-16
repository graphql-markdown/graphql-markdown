// packages/utils/tests/unit/array.property.test.ts
import * as fc from "fast-check";

import { convertArrayToMapObject, toArray } from "../../src/array";

describe("array (property-based)", () => {
  test("toArray() preserves the number of keys and the values", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(fc.dictionary(fc.string(), fc.anything()), (record) => {
        const result = toArray(record);
        expect(result).toHaveLength(Object.keys(record).length);
        expect(result).toStrictEqual(Object.values(record));
      }),
    );
  });

  test("convertArrayToMapObject() maps each name to a member of the input", () => {
    expect.hasAssertions();

    fc.assert(
      fc.property(
        fc.array(fc.record({ name: fc.string({ minLength: 1 }), n: fc.nat() })),
        (list) => {
          const map = convertArrayToMapObject(list)!;
          expect(Object.keys(map).length).toBeLessThanOrEqual(list.length);
          for (const [key, entry] of Object.entries(map)) {
            expect(list).toContain(entry);
            expect(entry.name).toBe(key);
          }
          for (const entry of list) {
            expect(map[entry.name].name).toBe(entry.name);
          }
        },
      ),
    );
  });
});
