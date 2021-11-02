const mockfs = require("mock-fs");

const path = require("path");
const { promises: fs } = require("fs"); // must be loaded after mock-fs

const { fileExists } = require("../../../src/utils/helpers/fs");

jest.mock("../../../src/lib/graphql");
const graphql = require("../../../src/lib/graphql");

jest.mock("@graphql-inspector/core");
const inspector = require("@graphql-inspector/core");

const {
  checkSchemaChanges,
  saveSchemaHash,
  saveSchemaFile,
} = require("../../../src/lib/diff");

describe("lib", () => {
  const FOLDER = "output";
  const SCHEMA_FILE = `${FOLDER}/schema.graphql`;
  const HASH_FILE = `${FOLDER}/.schema`;

  beforeEach(() => {
    mockfs({ [FOLDER]: {} });
  });

  afterEach(() => {
    mockfs.restore();
  });

  describe("diff", () => {
    const EXPECT_PATH = path.join(
      __dirname,
      "__expect__",
      __OS__,
      path.basename(__filename),
    );

    describe("checkSchemaChanges()", () => {
      test("returns true if no valid comparison method is selected", async () => {
        expect.hasAssertions();

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        const check = await checkSchemaChanges("schema", FOLDER, "FOOBAR");

        expect(check).toBeTruthy();
      });

      test("returns true if SCHEMA-HASH comparison differs", async () => {
        expect.hasAssertions();

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
        expect.hasAssertions();

        jest.spyOn(graphql, "printSchema").mockImplementation(() => "schema");

        await saveSchemaHash("SCHEMA", FOLDER);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-HASH");

        expect(check).toBeFalsy();
      });

      test("returns true if SCHEMA-HASH comparison has no reference hash file", async () => {
        expect.hasAssertions();

        jest.spyOn(graphql, "printSchema").mockImplementation(() => "schema");

        const hasHashFile = await fileExists(HASH_FILE);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-HASH");

        expect(hasHashFile).toBeFalsy();
        expect(check).toBeTruthy();
      });

      test("returns true if SCHEMA-DIFF comparison differs", async () => {
        expect.hasAssertions();

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => ({}));
        jest
          .spyOn(graphql, "getDocumentLoaders")
          .mockImplementationOnce(() => ({ loaders: [] }));
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
        expect.hasAssertions();

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => ({}));
        jest
          .spyOn(graphql, "getDocumentLoaders")
          .mockImplementationOnce(() => ({ loaders: [] }));
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([]));

        await saveSchemaFile("SCHEMA", FOLDER);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-DIFF");

        expect(check).toBeFalsy();
      });

      test("returns true if SCHEMA-DIFF no schema introspection file exists", async () => {
        expect.hasAssertions();

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => ({}));
        jest
          .spyOn(graphql, "getDocumentLoaders")
          .mockImplementationOnce(() => ({ loaders: [] }));
        jest
          .spyOn(inspector, "diff")
          .mockImplementationOnce(() => Promise.resolve([]));

        const hasSchemaFile = await fileExists(SCHEMA_FILE);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-DIFF");

        expect(hasSchemaFile).toBeFalsy();
        expect(check).toBeTruthy();
      });
    });

    describe("saveSchemaFile()", () => {
      const { saveSchemaFile } = require("../../../src/lib/diff");

      test("saves introspection schema locally", async () => {
        expect.hasAssertions();

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        await saveSchemaFile("SCHEMA", FOLDER);
        const file = await fs.readFile(SCHEMA_FILE, "utf8");

        mockfs.restore(); // see https://github.com/tschaub/mock-fs#caveats

        expect(file).toMatchFile(
          path.join(EXPECT_PATH, `saveSchemaFile.schema`),
        );
      });
    });

    describe("saveSchemaHash()", () => {
      const { saveSchemaHash } = require("../../../src/lib/diff");

      test("saves schema hash into .schema file", async () => {
        expect.hasAssertions();

        jest
          .spyOn(graphql, "printSchema")
          .mockImplementationOnce(() => "schema");

        await saveSchemaHash("SCHEMA", FOLDER);

        const file = await fs.readFile(HASH_FILE, "utf8");

        mockfs.restore(); // see https://github.com/tschaub/mock-fs#caveats

        expect(file).toMatchFile(path.join(EXPECT_PATH, `saveSchemaHash.hash`));
      });
    });
  });
});
