const t = require("tap");
const sinon = require("sinon");

const {
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLDirective,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
} = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printDeprecation()", async () => {
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

  t.test("prints deprecated badge if type is deprecated", async () => {
    const type = {
      name: "EntityTypeName",
      isDeprecated: true,
    };
    const deprecation = printerInstance.printDeprecation(type);

    t.matchSnapshot(
      deprecation,
      "prints deprecated badge if type is deprecated",
    );
  });

  t.test(
    "prints deprecation reason if type is deprecated with reason",
    async () => {
      const type = {
        name: "EntityTypeName",
        isDeprecated: true,
        deprecationReason: "foobar",
      };
      const deprecation = printerInstance.printDeprecation(type);

      t.matchSnapshot(
        deprecation,
        "prints deprecation reason if type is deprecated with reason",
      );
    },
  );

  t.test(
    "does not print deprecated badge if type is not deprecated",
    async () => {
      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
        specifiedByURL: "https://lorem.ipsum",
      });

      const deprecation = printerInstance.printDeprecation(type);

      t.equal(deprecation, "");
    },
  );
});
