export const checkSchemaChanges = jest.fn();
export enum COMPARE_METHOD {
    DIFF = "SCHEMA-DIFF",
    HASH = "SCHEMA-HASH",
    FORCE = "FORCE",
    NONE=  "NONE",
  };
