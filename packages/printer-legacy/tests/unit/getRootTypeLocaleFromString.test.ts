import t from "tap";

import Printer from "../../src/printer";
import { GraphQLSchema } from "graphql";

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("getRootTypeLocaleFromString()", async () => {
  const baseURL = "graphql";
  const root = "docs";

  const printerInstance = new Printer(new GraphQLSchema({}), baseURL, root, {});

  t.test("returns object of local strings from root type string", async () => {
    const res = printerInstance.getRootTypeLocaleFromString("queries");

    t.matchSnapshot(
      res,
      "returns object of local strings from root type string"
    );
  });
});
