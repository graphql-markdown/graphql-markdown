import { Logger, type GraphQLSchema } from "@graphql-markdown/utils";

const logger = Logger.getInstance();

export type FunctionCheckSchemaChanges = (
  schema: GraphQLSchema,
  tmpDir: string,
  diffMethod?: unknown,
) => Promise<boolean>;

export const hasChanges = async (
  schema: GraphQLSchema,
  tmpDir: string,
  diffMethod: unknown,
  diffModule: undefined | null | string = "@graphql-markdown/diff",
): Promise<boolean> => {
  if (
    typeof diffMethod === "undefined" ||
    diffMethod == null ||
    typeof diffModule === "undefined" ||
    diffModule == null
  ) {
    return true;
  }

  try {
    const {
      checkSchemaChanges,
    }: { checkSchemaChanges: FunctionCheckSchemaChanges } = await import(
      diffModule
    );
    return await checkSchemaChanges(schema, tmpDir, diffMethod);
  } catch (error) {
    logger.warn(
      `Cannot find module '${diffModule}' from @graphql-markdown/core!`,
    );
    return true;
  }
};
