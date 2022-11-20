const t = require("tap");
const sinon = require("sinon");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printSection()", async () => {
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

  t.test("returns Markdown ### section by default", async () => {
    const title = "section title";
    const content = "section content";

    const spy = sandbox
      .stub(printerInstance, "printSectionItems")
      .callsFake((sectionItems) => sectionItems);

    const section = printerInstance.printSection(content, title);

    t.ok(
      spy.calledWith(content, {
        parentType: undefined,
      })
    );

    t.matchSnapshot(section, "returns Markdown ### section by default");
  });

  t.test("returns Markdown custom section level", async () => {
    const title = "section title";
    const content = "section content";

    sandbox
      .stub(printerInstance, "printSectionItems")
      .callsFake((sectionItems) => sectionItems);

    const section = printerInstance.printSection(content, title, {
      level: "#",
    });

    t.matchSnapshot(section, "returns Markdown custom section level");
  });

  t.test("returns empty string if content is empty", async () => {
    const title = "section title";
    const content = "";

    const section = printerInstance.printSection(content, title);

    t.equal(section, "");
  });
});
