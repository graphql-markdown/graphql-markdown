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
        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });
        const check = await checkSchemaChanges("schema", FOLDER, "FOOBAR");
        expect(check).toBeTruthy();
      });

      test("returns true if SCHEMA-HASH comparison differs", async () => {
        const printSchema = jest.spyOn(graphql, "printSchema");

        printSchema.mockImplementationOnce(() => {
          return "schema";
        });
        await saveSchemaHash("SCHEMA", FOLDER);

        printSchema.mockImplementationOnce(() => {
          return "schema-new";
        });
        const check = await checkSchemaChanges(
          "schema-new",
          FOLDER,
          "SCHEMA-HASH"
        );
        expect(check).toBeTruthy();
      });

      test("returns false if SCHEMA-HASH comparison is equals", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementation(() => {
          return "schema";
        });

        await saveSchemaHash("SCHEMA", FOLDER);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-HASH");
        expect(check).toBeFalsy();
      });

      test("returns true if SCHEMA-HASH comparison has no reference hash file", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementation(() => {
          return "schema";
        });

        expect(fs.existsSync(HASH_FILE)).toBeFalsy();
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-HASH");
        expect(check).toBeTruthy();
      });

      test("returns true if SCHEMA-DIFF comparison differs", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => {});
        jest.spyOn(inspector, "diff").mockImplementationOnce(async () => {
          return Promise.resolve([1]);
        });

        await saveSchemaFile("SCHEMA", FOLDER);
        const check = await checkSchemaChanges(
          "schema-new",
          FOLDER,
          "SCHEMA-DIFF"
        );
        expect(check).toBeTruthy();
      });

      test("returns false if SCHEMA-DIFF comparison is equals", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => {});
        jest.spyOn(inspector, "diff").mockImplementationOnce(async () => {
          return Promise.resolve([]);
        });

        await saveSchemaFile("SCHEMA", FOLDER);
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-DIFF");
        expect(check).toBeFalsy();
      });

      test("returns true if SCHEMA-DIFF no schema introspection file exists", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });
        jest.spyOn(graphql, "loadSchema").mockImplementationOnce(() => {});
        jest.spyOn(inspector, "diff").mockImplementationOnce(async () => {
          return Promise.resolve([]);
        });

        expect(fs.existsSync(SCHEMA_FILE)).toBeFalsy();
        const check = await checkSchemaChanges("schema", FOLDER, "SCHEMA-DIFF");
        expect(check).toBeTruthy();
      });
    });

    describe("saveSchemaFile()", () => {
      const { saveSchemaFile } = require("@/lib/diff");

      test("saves introspection schema locally", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });

        await saveSchemaFile("SCHEMA", FOLDER);
        expect(fs.readFileSync(SCHEMA_FILE, "utf8")).toMatchSnapshot();
      });
    });

    describe("saveSchemaHash()", () => {
      const { saveSchemaHash } = require("@/lib/diff");

      test("saves schema hash into .schema file", async () => {
        jest.spyOn(graphql, "printSchema").mockImplementationOnce(() => {
          return "schema";
        });

        await saveSchemaHash("SCHEMA", FOLDER);
        expect(fs.readFileSync(HASH_FILE, "utf8")).toMatchSnapshot();
      });
    });
  });
});
