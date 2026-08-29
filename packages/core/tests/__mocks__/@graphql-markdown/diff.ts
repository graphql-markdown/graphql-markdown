import { vi } from "vitest";

export const checkSchemaChanges = vi.fn();

export enum COMPARE_METHOD {
  DIFF = "SCHEMA-DIFF",
  HASH = "SCHEMA-HASH",
  FORCE = "FORCE",
  NONE = "NONE",
}
