const t = require("tap");
const sinon = require("sinon");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("getRootTypeLocaleFromString()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = {
    toString: () => "SCHEMA",
    getType: (type) => type,
    getTypeMap: () => {},
    getDirectives: () => {},
    getImplementations: () => {},
    getRootType: () => undefined,
    getQueryType: () => undefined,
    getMutationType: () => undefined,
    getSubscriptionType: () => undefined,
  };

  const printerInstance = new Printer(schema, baseURL, root);

  t.afterEach(() => {
    sandbox.restore();
  });

  t.test("returns object of local strings from root type string", async () => {
    const deprecation = printerInstance.getRootTypeLocaleFromString("queries");

    t.matchSnapshot(
      deprecation,
      "returns object of local strings from root type string",
    );
  });
});
