import type { DocumentNode, GraphQLSchema } from "graphql";
import { getCachedDocumentNodeFromSchema, type PluginFunction, type Types } from "@graphql-codegen/plugin-helpers";

export const plugin: PluginFunction = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: Record<string, unknown>,
): string => {
  const astNode = getCachedDocumentNodeFromSchema(schema); // Transforms the GraphQLSchema into ASTNode
  const visitor = {
    FieldDefinition(node) {
      // Transform the field AST node into a string, containing only the name of the field
      return node.name.value as string;
    },
    ObjectTypeDefinition(node) {
      // "node.fields" is an array of strings, because we transformed it using "FieldDefinition".
      return node.fields
        .map((field: any) => {
          return `${node.name.value}.${field}`;
        })
        .join("\n");
    },
  };

  const result = oldVisit(astNode, { leave: visitor });

  return result.definitions.join("\n");
};
