import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, test } from "vitest";

import { buildSchema } from "graphql/utilities";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import type { DirectiveName, SchemaMap } from "@graphql-markdown/types";

import {
  getGroups,
  getRelationOfField,
  getRelationOfImplementation,
  getRelationOfReturn,
  getSchemaMap,
  loadSchema,
} from "../../src";

const SCHEMA_LOCATION = join(
  __dirname,
  "../../../core/tests/__data__/swapi.graphql",
);
const SCHEMA_SDL = readFileSync(SCHEMA_LOCATION, "utf-8");

const schema = buildSchema(SCHEMA_SDL);
const schemaMap: SchemaMap = getSchemaMap(schema);

const allTypes: unknown[] = Object.values(schemaMap).flatMap((entities) => {
  return entities ? Object.values(entities) : [];
});

describe("@graphql-markdown/graphql", () => {
  test("schema loading", async ({ bench }) => {
    await bench.compare(
      bench("buildSchema (swapi)", () => {
        buildSchema(SCHEMA_SDL);
      }),
      bench("loadSchema with GraphQLFileLoader (swapi)", async () => {
        await loadSchema(SCHEMA_LOCATION, {
          loaders: [new GraphQLFileLoader()],
        });
      }),
    );
  });

  test("schema introspection", async ({ bench }) => {
    await bench.compare(
      bench("getSchemaMap (swapi)", () => {
        getSchemaMap(schema);
      }),
      bench("getGroups (swapi)", () => {
        getGroups(schemaMap, {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        });
      }),
    );
  });

  test("relations", async ({ bench }) => {
    await bench.compare(
      bench("getRelationOfReturn for every type (swapi)", () => {
        for (const type of allTypes) {
          getRelationOfReturn(type, schemaMap);
        }
      }),
      bench("getRelationOfField for every type (swapi)", () => {
        for (const type of allTypes) {
          getRelationOfField(type, schemaMap);
        }
      }),
      bench("getRelationOfImplementation for every type (swapi)", () => {
        for (const type of allTypes) {
          getRelationOfImplementation(type, schemaMap);
        }
      }),
    );
  });
});
