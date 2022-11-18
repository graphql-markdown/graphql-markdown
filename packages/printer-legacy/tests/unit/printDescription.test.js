const t = require("tap");
const sinon = require("sinon");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printDescription()", async () => {
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

  t.test("returns the type description text", async () => {
    const type = { description: "Lorem ipsum" };
    const description = printerInstance.printDescription(type);

    t.matchSnapshot(description, "returns the type description text");
  });

  t.test("returns the default text if no description", async () => {
    const type = {};
    const description = printerInstance.printDescription(type);

    t.matchSnapshot(description, "returns the default text if no description");
  });

  t.test("return DEPRECATED tag if deprecated", async () => {
    const type = {
      description: "Lorem ipsum",
      isDeprecated: true,
      deprecationReason: "Foobar",
    };
    const description = printerInstance.printDescription(type);

    t.matchSnapshot(description, "return DEPRECATED tag if deprecated");
  });
});
