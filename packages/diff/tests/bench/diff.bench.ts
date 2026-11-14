import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, describe, test } from "vitest";

import { buildSchema } from "graphql/utilities";

import { getDiff, getSchemaHash } from "../../src";

const SCHEMA_SDL = readFileSync(
  join(__dirname, "../../../core/tests/__data__/swapi.graphql"),
  "utf-8",
);

const schema = buildSchema(SCHEMA_SDL);
// Same schema with one extra type, so the diff has a change to report.
const changedSchema = buildSchema(
  `${SCHEMA_SDL}\ntype Starship2 {\n  id: ID!\n  name: String\n}\n`,
);

const outputDir = mkdtempSync(join(tmpdir(), "gqlmd-diff-bench-"));
const schemaRef = join(outputDir, "schema.graphql");
writeFileSync(schemaRef, SCHEMA_SDL);

describe("@graphql-markdown/diff", () => {
  afterAll(() => {
    rmSync(outputDir, { recursive: true, force: true });
  });

  test("getSchemaHash", async ({ bench }) => {
    await bench("getSchemaHash (swapi)", () => {
      getSchemaHash(schema);
    }).run();
  });

  test("getDiff", async ({ bench }) => {
    await bench.compare(
      bench("getDiff unchanged schema (swapi)", async () => {
        await getDiff(schema, schemaRef);
      }),
      bench("getDiff changed schema (swapi)", async () => {
        await getDiff(changedSchema, schemaRef);
      }),
    );
  });
});
