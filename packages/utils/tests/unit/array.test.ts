import t from "tap";

import { toArray } from "../../src/array";

t.test("array", async () => {
  t.test("toArray()", async () => {
    t.test("returns an array of values from a k/v object", async ({ same }) => {
      const input = {
        bool: true,
        string: "test",
        number: 123,
        array: ["one", "two"],
        child: { key: "value" },
      };
      const expected = [true, "test", 123, ["one", "two"], { key: "value" }];
      same(toArray(input), expected);
    });
  });
  t.end();
});
