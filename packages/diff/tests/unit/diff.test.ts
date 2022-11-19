import t from "tap";
import esmock from "esmock";

// import { vol } from "memfs";

const mocks = {
  "@graphql-markdown/utils/graphql": {
    printSchema: (schema: any) => schema,
    loadSchema: async () => ({}),
  },
  "@graphql-markdown/utils/fs": {
    fileExists: async () => false,
  },
  "@graphql-inspector/core": {
    diff: () => [],
  },
};

t.test("diff", async () => {
  t.beforeEach(() => {
    // vol.fromJSON({}, "/output");
  });

  t.afterEach(() => {
    // vol.reset();
  });

  t.test("checkSchemaChanges()", async () => {
    t.test(
      "returns true if no valid comparison method is selected",
      async () => {
        const { checkSchemaChanges } = await esmock(
          "../../src/diff",
          import.meta.url,
          mocks
        );

        const check = await checkSchemaChanges("schema", "/output", "FOOBAR");

        t.ok(check);
      }
    );

    t.test(
      "returns true if COMPARE_METHOD.HASH comparison differs",
      async () => {
        const { checkSchemaChanges, COMPARE_METHOD } = await esmock(
          "../../src/diff",
          import.meta.url,
          mocks
        );

        const check = await checkSchemaChanges(
          "schema-new",
          "/output",
          COMPARE_METHOD.HASH
        );

        t.ok(check);
      }
    );

    //   t.test(
    //     "returns false if COMPARE_METHOD.HASH comparison is equals",
    //     async () => {
    //       sandbox.stub(graphql, "printSchema").callsFake(() => "schema");

    //       vol.fromJSON({
    //         [`${"/output"}/${SCHEMA_HASH_FILE}`]:
    //           "df0ad6e43880f09c90ebf95f19110178aba6890df0010ebda7485029e2b543b4",
    //       });

    //       const check = await checkSchemaChanges(
    //         "schema",
    //         "/output",
    //         COMPARE_METHOD.HASH
    //       );

    //       t.notOk(check);
    //     }
    //   );

    //   t.test(
    //     "returns true if COMPARE_METHOD.HASH comparison has no reference hash file",
    //     async () => {
    //       sandbox.stub(graphql, "printSchema").callsFake(() => "schema");

    //       vol.fromJSON({
    //         [`${"/output"}/${SCHEMA_REF}`]: "schema",
    //       });

    //       const check = await checkSchemaChanges(
    //         "schema",
    //         "/output",
    //         COMPARE_METHOD.HASH
    //       );

    //       t.ok(check);
    //     }
    //   );

    //   t.test(
    //     "returns true if COMPARE_METHOD.DIFF comparison differs",
    //     async () => {
    //       sandbox.stub(graphql, "printSchema").callsFake(() => "schema");
    //       sandbox
    //         .stub(graphql, "loadSchema")
    //         .callsFake(async () => Promise.resolve({}));
    //       sandbox
    //         .stub(inspector, "diff")
    //         .callsFake(async () => Promise.resolve([1]));

    //       vol.fromJSON({
    //         [`${"/output"}/${SCHEMA_REF}`]: "schema",
    //       });

    //       const check = await checkSchemaChanges(
    //         "schema-new",
    //         "/output",
    //         COMPARE_METHOD.DIFF
    //       );

    //       t.ok(check);
    //     }
    //   );

    //   t.test(
    //     "returns false if COMPARE_METHOD.DIFF comparison is equals",
    //     async () => {
    //       sandbox.stub(graphql, "printSchema").callsFake(() => "schema");
    //       sandbox
    //         .stub(graphql, "loadSchema")
    //         .callsFake(async () => Promise.resolve({}));
    //       sandbox
    //         .stub(inspector, "diff")
    //         .callsFake(async () => Promise.resolve([]));

    //       vol.fromJSON({
    //         [`${"/output"}/${SCHEMA_REF}`]: "schema",
    //       });

    //       const check = await checkSchemaChanges(
    //         "schema",
    //         "/output",
    //         COMPARE_METHOD.DIFF
    //       );

    //       t.notOk(check);
    //     }
    //   );

    //   t.test(
    //     "returns true if COMPARE_METHOD.DIFF no schema introspection file exists",
    //     async () => {
    //       sandbox.stub(graphql, "printSchema").callsFake(() => "schema");
    //       sandbox
    //         .stub(graphql, "loadSchema")
    //         .callsFake(() => Promise.resolve({}));
    //       sandbox
    //         .stub(inspector, "diff")
    //         .callsFake(async () => Promise.resolve([]));

    //       const check = await checkSchemaChanges(
    //         "schema",
    //         "/output",
    //         COMPARE_METHOD.DIFF
    //       );

    //       t.ok(check);
    //     }
    //   );
  });
});
