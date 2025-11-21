/* eslint-disable @typescript-eslint/no-unsafe-return */
import { vol } from "memfs";

jest.mock("node:fs/promises", () => {
  // Return the memfs vol promises directly
  const { vol: fsVol } = require("memfs");
  return fsVol.promises;
});

import type { DiffMethodName } from "@graphql-markdown/types";

import { GraphQLSchema } from "graphql/type";

jest.mock("graphql/utilities");
import * as graphql from "graphql/utilities";

jest.mock("@graphql-tools/load");
import * as graphqlLoad from "@graphql-tools/load";

jest.mock("@graphql-inspector/core");
import * as inspector from "@graphql-inspector/core";
import type { Change } from "@graphql-inspector/core/typings/diff/changes/change";

import {
  checkSchemaChanges,
  CompareMethod,
  SCHEMA_HASH_FILE,
  SCHEMA_REF,
} from "../../src/index";

describe("lib", () => {
  describe("diff", () => {
    beforeEach(() => {
      vol.fromJSON({
        "/output": null,
      });
    });

    afterEach(() => {
      vol.reset();
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    describe("checkSchemaChanges()", () => {
      test("returns true if no valid comparison method is selected", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });

        const check: boolean = await checkSchemaChanges(
          new GraphQLSchema({}),
          "/output",
          "FOOBAR" as DiffMethodName,
        );

        expect(check).toBeTruthy();
      });

      test("returns true if CompareMethod.HASH comparison differs", async () => {
        expect.assertions(1);

        const printSchema = jest.spyOn(graphql, "printSchema");
        printSchema.mockImplementationOnce(() => {
          return "schema";
        });

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_HASH_FILE}`]: "",
        });

        printSchema.mockImplementationOnce(() => {
          return "schema-new";
        });
        const check = await checkSchemaChanges(
          new GraphQLSchema({}),
          "/output",
          CompareMethod.HASH as DiffMethodName,
        );

        expect(check).toBeTruthy();
      });

      test("returns false if CompareMethod.HASH comparison is equals", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementation(() => {
          return "schema";
        });

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_HASH_FILE}`]:
            "df0ad6e43880f09c90ebf95f19110178aba6890df0010ebda7485029e2b543b4",
        });

        const check = await checkSchemaChanges(
          new GraphQLSchema({}),
          "/output",
          CompareMethod.HASH as DiffMethodName,
        );

        expect(check).toBeFalsy();
      });

      test("returns true if CompareMethod.HASH comparison has no reference hash file", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementation(() => {
          return "schema";
        });

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_REF}`]: "schema",
        });

        const check = await checkSchemaChanges(
          new GraphQLSchema({}),
          "/output",
          CompareMethod.HASH as DiffMethodName,
        );

        expect(check).toBeTruthy();
      });

      test("returns true if CompareMethod.DIFF comparison differs", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });
        jest
          .spyOn(graphqlLoad, "loadSchema")
          .mockImplementationOnce(async () => {
            return Promise.resolve(new GraphQLSchema({}));
          });
        const changes: Change[] = [];
        changes.push({
          message: "",
          type: "",
          meta: "",
          criticality: { level: inspector.CriticalityLevel.Breaking },
        });
        jest.spyOn(inspector, "diff").mockImplementationOnce(async () => {
          return Promise.resolve(changes);
        });

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_REF}`]: "schema",
        });

        const check = await checkSchemaChanges(
          new GraphQLSchema({}),
          "/output",
          CompareMethod.DIFF as DiffMethodName,
        );

        expect(check).toBeTruthy();
      });

      test("returns false if CompareMethod.DIFF comparison is equals", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });
        jest
          .spyOn(graphqlLoad, "loadSchema")
          .mockImplementationOnce(async () => {
            return Promise.resolve(new GraphQLSchema({}));
          });
        jest.spyOn(inspector, "diff").mockImplementationOnce(async () => {
          return Promise.resolve([]);
        });

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_REF}`]: "schema",
        });

        const check = await checkSchemaChanges(
          new GraphQLSchema({}),
          "/output",
          CompareMethod.DIFF as DiffMethodName,
        );

        expect(check).toBeFalsy();
      });

      test("returns true if CompareMethod.DIFF no schema introspection file exists", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });
        jest
          .spyOn(graphqlLoad, "loadSchema")
          .mockImplementationOnce(async () => {
            return Promise.resolve(new GraphQLSchema({}));
          });
        jest.spyOn(inspector, "diff").mockImplementationOnce(async () => {
          return Promise.resolve([]);
        });

        const check = await checkSchemaChanges(
          new GraphQLSchema({}),
          "/output",
          CompareMethod.DIFF as DiffMethodName,
        );

        expect(check).toBeTruthy();
      });
    });
  });
});
