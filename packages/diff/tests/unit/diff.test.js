const { vol } = require("memfs");
jest.mock("fs");

jest.mock("graphql");
const graphql = require("graphql");

jest.mock("@graphql-tools/load");
const graphqlLoad = require("@graphql-tools/load");

jest.mock("@graphql-inspector/core");
const inspector = require("@graphql-inspector/core");

const {
  checkSchemaChanges,
  COMPARE_METHOD,
  SCHEMA_HASH_FILE,
  SCHEMA_REF,
} = require("../../src/index");

describe("lib", () => {
  describe("diff", () => {
    beforeEach(() => {
      vol.fromJSON({
        "/output": {},
      });
    });

    afterEach(() => {
      vol.reset();
    });

    describe("checkSchemaChanges()", () => {
      test("returns true if no valid comparison method is selected", async () => {
        expect.assertions(1);

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        const check = await checkSchemaChanges("schema", "/output", "FOOBAR");

        expect(check).toBeTruthy();
      });

      test("returns true if COMPARE_METHOD.HASH comparison differs", async () => {
        expect.assertions(1);

        const printSchema = jest.spyOn(graphql, "printSchema");
        printSchema.mockImplementationOnce(() => "schema");

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_HASH_FILE}`]: "",
        });

        printSchema.mockImplementationOnce(() => "schema-new");
        const check = await checkSchemaChanges(
          "schema-new",
          "/output",
          COMPARE_METHOD.HASH,
        );

        expect(check).toBeTruthy();
      });

      test("returns false if COMPARE_METHOD.HASH comparison is equals", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementation(() => "schema");

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_HASH_FILE}`]:
            "df0ad6e43880f09c90ebf95f19110178aba6890df0010ebda7485029e2b543b4",
        });

        const check = await checkSchemaChanges(
          "schema",
          "/output",
          COMPARE_METHOD.HASH,
        );

        expect(check).toBeFalsy();
      });

      test("returns true if COMPARE_METHOD.HASH comparison has no reference hash file", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementation(() => "schema");

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_REF}`]: "schema",
        });

        const check = await checkSchemaChanges(
          "schema",
          "/output",
          COMPARE_METHOD.HASH,
        );

        expect(check).toBeTruthy();
      });

      test("returns true if COMPARE_METHOD.DIFF comparison differs", async () => {
        expect.assertions(1);

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest
          .spyOn(graphqlLoad, "loadSchema")
          .mockImplementationOnce(() => ({}));
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([1]));

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_REF}`]: "schema",
        });

        const check = await checkSchemaChanges(
          "schema-new",
          "/output",
          COMPARE_METHOD.DIFF,
        );

        expect(check).toBeTruthy();
      });

      test("returns false if COMPARE_METHOD.DIFF comparison is equals", async () => {
        expect.assertions(1);

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest
          .spyOn(graphqlLoad, "loadSchema")
          .mockImplementationOnce(() => ({}));
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([]));

        vol.fromJSON({
          [`${"/output"}/${SCHEMA_REF}`]: "schema",
        });

        const check = await checkSchemaChanges(
          "schema",
          "/output",
          COMPARE_METHOD.DIFF,
        );

        expect(check).toBeFalsy();
      });

      test("returns true if COMPARE_METHOD.DIFF no schema introspection file exists", async () => {
        expect.assertions(1);

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest
          .spyOn(graphqlLoad, "loadSchema")
          .mockImplementationOnce(() => ({}));
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([]));

        const check = await checkSchemaChanges(
          "schema",
          "/output",
          COMPARE_METHOD.DIFF,
        );

        expect(check).toBeTruthy();
      });
    });
  });
});
