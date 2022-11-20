const t = require("tap");
const sinon = require("sinon");

const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printSectionItem()", async () => {
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

  t.test("returns Markdown #### link section with description", async () => {
    const type = new GraphQLObjectType({
      name: "EntityTypeName",
      description: "Lorem ipsum",
    });

    const section = printerInstance.printSectionItem(type);

    t.matchSnapshot(
      section,
      "returns Markdown #### link section with description"
    );
  });

  t.test(
    "returns Markdown #### link section with sub type is non-nullable",
    async () => {
      const type = {
        name: "EntityTypeName",
        type: new GraphQLNonNull(
          new GraphQLObjectType({
            name: "NonNullableObjectType",
          })
        ),
      };

      const section = printerInstance.printSectionItem(type);

      t.matchSnapshot(
        section,
        "returns Markdown #### link section with sub type is non-nullable"
      );
    }
  );

  t.test(
    "returns Markdown #### link section with sub type list and non-nullable",
    async () => {
      const type = {
        name: "EntityTypeName",
        type: new GraphQLNonNull(
          new GraphQLList(
            new GraphQLObjectType({
              name: "NonNullableObjectType",
            })
          )
        ),
      };

      const section = printerInstance.printSectionItem(type);

      t.matchSnapshot(
        section,
        "returns Markdown #### link section with sub type list and non-nullable"
      );
    }
  );

  t.test(
    "returns Markdown #### link section with field parameters",
    async () => {
      const type = {
        name: "EntityTypeName",
        args: [
          {
            name: "ParameterTypeName",
            type: GraphQLString,
          },
        ],
      };

      const spy = sandbox.spy(printerInstance, "printSectionItems");

      const section = printerInstance.printSectionItem(type);

      t.ok(
        spy.calledWith(type.args, {
          level: "#####",
          parentType: undefined,
        })
      );
      t.matchSnapshot(
        section,
        "returns Markdown #### link section with field parameters"
      );
    }
  );

  t.test(
    "returns Markdown #### link section with non empty nullable list [!]",
    async () => {
      const type = {
        name: "EntityTypeNameList",
        type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
      };

      const section = printerInstance.printSectionItem(type);

      t.matchSnapshot(
        section,
        "returns Markdown #### link section with non empty nullable list [!]"
      );
    }
  );

  t.test(
    "returns Markdown #### link section with non empty no nullable list [!]!",
    async () => {
      const type = {
        name: "EntityTypeNameList",
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(GraphQLInt))
        ),
      };

      const section = printerInstance.printSectionItem(type);

      t.matchSnapshot(
        section,
        "returns Markdown #### link section with non empty no nullable list [!]!"
      );
    }
  );
});
