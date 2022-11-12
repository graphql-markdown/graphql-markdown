import t from "tap";

import { hasProperty, hasMethod } from "../../src/object";

t.test("hasProperty()", async ({ ok, notOk }) => {
  t.test("returns true if object has property", async () => {
    ok(hasProperty({ foo: "t.test" }, "foo"));
  });

  t.test("returns false if object has not property", async () => {
    notOk(hasProperty({ foo: "t.test" }, "bar"));
  });

  t.test("returns false if not an object", async () => {
    notOk(hasProperty("t.test", "bar"));
  });

  t.test("returns false if null", async () => {
    notOk(hasProperty(null, "bar"));
  });
});

t.test("hasMethod()", async ({ ok, notOk }) => {
  t.test("returns true if object has method", async () => {
    ok(hasMethod({ foo: () => ({}) }, "foo"));
  });

  t.test("returns false if object has not method", async () => {
    notOk(hasMethod({ foo: "t.test" }, "foo"));
  });
});
