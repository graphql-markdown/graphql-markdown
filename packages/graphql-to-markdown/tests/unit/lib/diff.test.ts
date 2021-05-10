import * as mock from "mock-fs";
import * as fs from "fs";
import type { GraphQLSchema } from "graphql";
import { Change, ChangeType, CriticalityLevel } from "@graphql-inspector/core";

import {
  checkSchemaChanges,
  saveSchemaHash,
  saveSchemaFile,
} from "../../../src/lib/diff";

jest.mock("../../../src/lib/graphql");
import * as graphql from "../../../src/lib/graphql";

jest.mock("@graphql-inspector/core");
import * as inspector from "@graphql-inspector/core";

const FOLDER = "output";
const SCHEMA_FILE = `${FOLDER}/schema.graphql`;
const HASH_FILE = `${FOLDER}/.schema`;

describe("lib", () => {
  beforeEach(() => {
    mock({ output: {} });
  });

  afterEach(() => {
    mock.restore();
  });

  describe("diff", () => {
    describe("checkSchemaChanges()", () => {
      test("returns true if no valid comparison method is selected", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        const check = await checkSchemaChanges("schema", FOLDER, "FOOBAR");
        expect(check).toBeTruthy();
      });

      test("returns true if SCHEMA-HASH comparison differs", async () => {
        const printSchema = jest.spyOn(graphql, "printSchema");

        printSchema.mockImplementationOnce(() => "schema");
        await saveSchemaHash("SCHEMA", FOLDER);

        printSchema.mockImplementationOnce(() => "schema-new");
        const check = await checkSchemaChanges(
          "schema-new",
          FOLDER,
          "SCHEMA-HASH",
        );
        expect(check).toBeTruthy();
      });

      test("returns false if SCHEMA-HASH comparison is equals", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementation(() => "schema");

        await saveSchemaHash("SCHEMA", FOLDER);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-HASH");
        expect(check).toBeFalsy();
      });

      test("returns true if SCHEMA-HASH comparison has no reference hash file", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementation(() => "schema");

        expect(fs.existsSync(HASH_FILE)).toBeFalsy();
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-HASH");
        expect(check).toBeTruthy();
      });

      test("returns true if SCHEMA-DIFF comparison differs", async () => {
        const changes: Change[] = [
          {
            message: "test",
            type: ChangeType.DirectiveAdded,
            criticality: { level: CriticalityLevel.Breaking },
          },
        ];

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest
          .spyOn(graphql, "loadSchema")
          .mockImplementationOnce(() => Promise.resolve({} as GraphQLSchema));
        jest.spyOn(inspector, "diff").mockImplementationOnce(() => changes);

        await saveSchemaFile("SCHEMA", FOLDER);
        const check = await checkSchemaChanges(
          "schema-new",
          FOLDER,
          "SCHEMA-DIFF",
        );
        expect(check).toBeTruthy();
      });

      test("returns false if SCHEMA-DIFF comparison is equals", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest
          .spyOn(graphql, "loadSchema")
          .mockImplementationOnce(() => Promise.resolve({} as GraphQLSchema));
        jest.spyOn(inspector, "diff").mockImplementationOnce(() => []);

        await saveSchemaFile("SCHEMA", FOLDER);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-DIFF");
        expect(check).toBeFalsy();
      });

      test("returns true if SCHEMA-DIFF no schema introspection file exists", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest
          .spyOn(graphql, "loadSchema")
          .mockImplementationOnce(() => Promise.resolve({} as GraphQLSchema));
        jest.spyOn(inspector, "diff").mockImplementationOnce(() => []);

        expect(fs.existsSync(SCHEMA_FILE)).toBeFalsy();
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-DIFF");
        expect(check).toBeTruthy();
      });
    });

    describe("saveSchemaFile()", () => {
      test("saves introspection schema locally", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        await saveSchemaFile("SCHEMA", FOLDER);
        expect(fs.readFileSync(SCHEMA_FILE, "utf8")).toMatchSnapshot();
      });
    });

    describe("saveSchemaHash()", () => {
      test("saves schema hash into .schema file", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        await saveSchemaHash("SCHEMA", FOLDER);
        expect(fs.readFileSync(HASH_FILE, "utf8")).toMatchSnapshot();
      });
    });
  });
});
