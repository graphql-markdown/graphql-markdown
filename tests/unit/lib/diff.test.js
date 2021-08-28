const mock = require("mock-fs");
const fs = require("fs");

jest.mock("@/lib/graphql");
const graphql = require("@/lib/graphql");

jest.mock("@graphql-inspector/core");
const inspector = require("@graphql-inspector/core");

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
      const {
        checkSchemaChanges,
        saveSchemaHash,
        saveSchemaFile,
      } = require("@/lib/diff");

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

        const hasHashFile = fs.existsSync(HASH_FILE);
        expect(hasHashFile).toBeFalsy();
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-HASH");
        expect(check).toBeTruthy();
      });

      test("returns true if SCHEMA-DIFF comparison differs", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => {});
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([1]));

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
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => {});
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([]));

        await saveSchemaFile("SCHEMA", FOLDER);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-DIFF");
        expect(check).toBeFalsy();
      });

      test("returns true if SCHEMA-DIFF no schema introspection file exists", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => {});
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([]));

        const hasSchemaFile = fs.existsSync(SCHEMA_FILE);
        expect(hasSchemaFile).toBeFalsy();
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-DIFF");
        expect(check).toBeTruthy();
      });
    });

    describe("saveSchemaFile()", () => {
      const { saveSchemaFile } = require("@/lib/diff");

      test("saves introspection schema locally", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        await saveSchemaFile("SCHEMA", FOLDER);
        const file = await fs.promises.readFile(SCHEMA_FILE, "utf8");

        mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

        expect(file).toMatchSnapshot();
      });
    });

    describe("saveSchemaHash()", () => {
      const { saveSchemaHash } = require("@/lib/diff");

      test("saves schema hash into .schema file", async () => {
        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        await saveSchemaHash("SCHEMA", FOLDER);

        const file = await fs.promises.readFile(HASH_FILE, "utf8");

        mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

        expect(file).toMatchSnapshot();
      });
    });
  });
});
