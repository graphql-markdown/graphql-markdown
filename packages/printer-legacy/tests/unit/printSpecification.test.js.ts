const t = require("tap");
const sinon = require("sinon");

const { GraphQLScalarType } = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printSpecification()", async () => {
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

  t.test(
    "prints specification link if directive specified by is present",
    async () => {
      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
        specifiedByURL: "https://lorem.ipsum",
      });

      const deprecation = printerInstance.printSpecification(type);

      t.matchSnapshot(
        deprecation,
        "prints specification link if directive specified by is present",
      );
    },
  );

  t.test(
    "does not print specification link if directive specified by is not present",
    async () => {
      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
      });

      const deprecation = printerInstance.printSpecification(type);

      t.equal(deprecation, "");
    },
  );
});
