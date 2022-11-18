import { GraphQLSchema } from "graphql/type/schema";
export declare const SCHEMA_HASH_FILE = ".schema";
export declare const SCHEMA_REF = "schema.graphql";
export declare enum COMPARE_METHOD {
    DIFF = "SCHEMA-DIFF",
    HASH = "SCHEMA-HASH",
    FORCE = "FORCE",
    NONE = "NONE"
}
export declare const checkSchemaChanges: (schema: GraphQLSchema, outputDir: string, method?: COMPARE_METHOD) => Promise<boolean>;
//# sourceMappingURL=diff.d.ts.map