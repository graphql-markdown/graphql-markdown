const { vol } = require("memfs");
jest.mock("fs");

const { fileExists } = require("../../src/utils/helpers/fs");

jest.mock("graphql");
const graphql = require("graphql");

jest.mock("@graphql-tools/load");
const graphqlLoad = require("@graphql-tools/load");

jest.mock("@graphql-inspector/core");
const inspector = require("@graphql-inspector/core");

const {
  checkSchemaChanges,
  saveSchemaHash,
  saveSchemaFile,
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
        expect.assertions(2);

        const printSchema = jest.spyOn(graphql, "printSchema");
        printSchema.mockImplementationOnce(() => "schema");

        await saveSchemaHash("SCHEMA", "/output");
        const hasHashFile = await fileExists(
          `${"/output"}/${SCHEMA_HASH_FILE}`,
        );

        printSchema.mockImplementationOnce(() => "schema-new");
        const check = await checkSchemaChanges(
          "schema-new",
          "/output",
          COMPARE_METHOD.HASH,
        );

        expect(hasHashFile).toBeTruthy();
        expect(check).toBeTruthy();
      });

      test("returns false if COMPARE_METHOD.HASH comparison is equals", async () => {
        expect.assertions(1);

        jest.spyOn(graphql, "printSchema").mockImplementation(() => "schema");

        await saveSchemaHash("SCHEMA", "/output");
        const check = await checkSchemaChanges(
          "schema",
          "/output",
          COMPARE_METHOD.HASH,
        );

        expect(check).toBeFalsy();
      });

      test("returns true if COMPARE_METHOD.HASH comparison has no reference hash file", async () => {
        expect.assertions(2);

        jest.spyOn(graphql, "printSchema").mockImplementation(() => "schema");

        const hasHashFile = await fileExists(
          `${"/output"}/${SCHEMA_HASH_FILE}`,
        );
        const check = await checkSchemaChanges(
          "schema",
          "/output",
          COMPARE_METHOD.HASH,
        );

        expect(hasHashFile).toBeFalsy();
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

        await saveSchemaFile("SCHEMA", "/output");
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

        await saveSchemaFile("SCHEMA", "/output");
        const check = await checkSchemaChanges(
          "schema",
          "/output",
          COMPARE_METHOD.DIFF,
        );

        expect(check).toBeFalsy();
      });

      test("returns true if COMPARE_METHOD.DIFF no schema introspection file exists", async () => {
        expect.assertions(2);

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest
          .spyOn(graphqlLoad, "loadSchema")
          .mockImplementationOnce(() => ({}));
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([]));

        const hasSchemaFile = await fileExists(`${"/output"}/${SCHEMA_REF}`);
        const check = await checkSchemaChanges(
          "schema",
          "/output",
          COMPARE_METHOD.DIFF,
        );

        expect(hasSchemaFile).toBeFalsy();
        expect(check).toBeTruthy();
      });
    });

    describe.each([
      [saveSchemaHash, SCHEMA_HASH_FILE],
      [saveSchemaFile, SCHEMA_REF],
    ])("%p", (method, reference) => {
      test(`saves reference data into file ${reference}`, async () => {
        expect.assertions(1);

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        await method("SCHEMA", "/output");

        expect(
          vol.toJSON(`/output/${reference}`, undefined, true),
        ).toMatchSnapshot();
      });
    });
  });
});
