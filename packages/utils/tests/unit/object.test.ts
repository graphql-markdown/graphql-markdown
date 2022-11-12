import t from "tap";

import { hasProperty, hasMethod } from "../../src/object";

t.test("hasProperty()", async () => {
  t.test("returns true if object has property", async () => {
    t.ok(hasProperty({ foo: "t.test" }, "foo"));
  });

  t.test("returns false if object has not property", async () => {
    t.notOk(hasProperty({ foo: "t.test" }, "bar"));
  });

  t.test("returns false if not an object", async () => {
    t.notOk(hasProperty("t.test", "bar"));
  });

  t.test("returns false if null", async () => {
    t.notOk(hasProperty(null, "bar"));
  });

  t.end();
});

t.test("hasMethod()", async () => {
  t.test("returns true if object has method", async () => {
    t.ok(hasMethod({ foo: () => ({}) }, "foo"));
  });

  t.test("returns false if object has not method", async () => {
    t.notOk(hasMethod({ foo: "t.test" }, "foo"));
  });

  t.end();
});
