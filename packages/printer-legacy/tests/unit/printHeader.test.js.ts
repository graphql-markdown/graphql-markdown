const t = require("tap");
const sinon = require("sinon");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printHeader()", async () => {
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

  t.test("returns a Docusaurus document header", async () => {
    const header = printerInstance.printHeader(
      "an-object-type-name",
      "An Object Type Name"
    );

    t.matchSnapshot(header, "returns a Docusaurus document header");
  });

  t.test("returns a Docusaurus document header with ToC disabled", async () => {
    const header = printerInstance.printHeader(
      "an-object-type-name",
      "An Object Type Name",
      { toc: false }
    );

    t.matchSnapshot(
      header,
      "returns a Docusaurus document header with ToC disabled"
    );
  });

  t.test(
    "returns a Docusaurus document header with pagination disabled",
    async () => {
      const header = printerInstance.printHeader(
        "an-object-type-name",
        "An Object Type Name",
        { pagination: false }
      );

      t.matchSnapshot(
        header,
        "returns a Docusaurus document header with pagination disabled"
      );
    }
  );
});
