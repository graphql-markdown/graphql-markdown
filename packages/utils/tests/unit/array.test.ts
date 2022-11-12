import t from "tap";

import { toArray } from "../../src/array";

t.test("toArray()", async () => {
  t.test("returns an array of values from a k/v object", async () => {
    const input = {
      bool: true,
      string: "test",
      number: 123,
      array: ["one", "two"],
      child: { key: "value" },
    };
    const expected = [true, "test", 123, ["one", "two"], { key: "value" }];
    t.same(toArray(input), expected);
  });

  t.end();
});
