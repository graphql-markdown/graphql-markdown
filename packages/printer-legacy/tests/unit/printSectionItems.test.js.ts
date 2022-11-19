const t = require("tap");
const sinon = require("sinon");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printSectionItems()", async () => {
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

  t.test("returns Markdown one line per item", async () => {
    const spy = sandbox
      .stub(printerInstance, "printSectionItem")
      .callsFake((sectionItems) => sectionItems);

    const itemList = ["one", "two", "three"];

    const section = printerInstance.printSectionItems(itemList);

    t.equal(spy.callCount, 3);
    t.same(spy.lastCall.args, [
      itemList.pop(),
      {
        level: "####",
        parentType: undefined,
      },
    ]);
    t.matchSnapshot(section, "returns Markdown one line per item");
  });

  t.test("returns empty text if not a list", async () => {
    const itemList = "list";

    const section = printerInstance.printSectionItems(itemList);

    t.equal(section, "");
  });
});
