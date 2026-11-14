import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, test } from "vitest";

import { buildSchema } from "graphql/utilities";

import type { SchemaMap } from "@graphql-markdown/types";
import { getSchemaMap } from "@graphql-markdown/graphql";

import { Printer } from "../../src/printer";

const SCHEMA_LOCATION = join(
  __dirname,
  "../../../core/tests/__data__/swapi.graphql",
);

const schema = buildSchema(readFileSync(SCHEMA_LOCATION, "utf-8"));
const schemaMap: SchemaMap = getSchemaMap(schema);

const entries: [string, unknown][] = Object.values(schemaMap).flatMap(
  (entities) => {
    return entities ? Object.entries(entities) : [];
  },
);

await Printer.init(schema, "graphql", "docs");

const objectType = schema.getType("Film");
const queryType = schema.getQueryType();

describe("@graphql-markdown/printer-legacy", () => {
  test("Printer.printType", async ({ bench }) => {
    await bench.compare(
      bench("print every type page (swapi)", async () => {
        for (const [name, type] of entries) {
          await Printer.printType(name, type);
        }
      }),
      bench("print object type page (Film)", async () => {
        await Printer.printType("Film", objectType);
      }),
      bench("print root query type page", async () => {
        await Printer.printType("Query", queryType);
      }),
    );
  });
});
