import {
  ASTNode,
  ArgumentNode,
  BooleanValueNode,
  DirectiveDefinitionNode,
  DirectiveNode,
  DocumentNode,
  EnumValueDefinitionNode,
  EnumValueNode,
  FieldDefinitionNode,
  FloatValueNode,
  InputValueDefinitionNode,
  IntValueNode,
  ListTypeNode,
  ListValueNode,
  NameNode,
  NamedTypeNode,
  NonNullTypeNode,
  ObjectFieldNode,
  ObjectTypeDefinitionNode,
  ObjectValueNode,
  OperationTypeDefinitionNode,
  OperationTypeNode,
  StringValueNode,
  TypeDefinitionNode,
  visit,
} from "graphql";

import { ParsedNode } from "..";

const GRAPHQL_KIND = {
  DirectiveDefinition: "DirectiveDefinition",
  EnumTypeDefinition: "EnumTypeDefinition",
  InputObjectTypeDefinition: "InputObjectTypeDefinition",
  InputTypeDefinition: "InputTypeDefinition",
  InterfaceTypeDefinition: "InterfaceTypeDefinition",
  ObjectTypeDefinition: "ObjectTypeDefinition",
  OperationTypeDefinition: "OperationTypeDefinition",
  ScalarTypeDefinition: "ScalarTypeDefinition",
  UnionTypeDefinition: "UnionTypeDefinition",
} as const;

const SIMPLIFIED_NODE_KIND = {
  DirectiveDefinition: "directive",
  EnumTypeDefinition: "enum",
  InputObjectTypeDefinition: "input",
  InputTypeDefinition: "interface",
  Mutation: "mutation",
  ObjectTypeDefinition: "object",
  OperationTypeDefinition: "operation",
  Query: "query",
  ScalarTypeDefinition: "scalar",
  Subscription: "subscription",
  UnionTypeDefinition: "union",
} as const;

const OPERATION_TYPE = {
  MUTATION: "Mutation",
  QUERY: "Query",
  SUBSCRIPTION: "Subscription",
} as const;

const visitor = {
  Argument: (node: ArgumentNode) => {
    return node;
  },
  BooleanValue: ({ value }: BooleanValueNode) => {
    return value;
  },
  Directive: (node: DirectiveNode) => {
    return { ...node, name: `@${node.name}` };
  },
  DirectiveDefinition: (node: DirectiveDefinitionNode) => {
    return { ...node, name: `@${node.name}` };
  },
  Document: ({ definitions }: DocumentNode) => {
    return definitions;
  },
  EnumValue: ({ value }: EnumValueNode) => {
    return value;
  },
  EnumValueDefinition: (node: EnumValueDefinitionNode) => {
    return node;
  },
  FieldDefinition: ({
    type,
    name,
    arguments: args,
    directives,
    kind,
    description,
  }: FieldDefinitionNode) => {
    return {
      ...type,
      arguments: args,
      description,
      directives,
      kind,
      name,
    };
  },
  FloatValue: ({ value }: FloatValueNode) => {
    return value;
  },
  InputValueDefinition: ({
    type,
    name,
    directives,
    defaultValue,
    kind,
    description,
  }: InputValueDefinitionNode) => {
    return {
      ...type,
      defaultValue,
      description,
      directives,
      kind,
      name,
    };
  },
  IntValue: ({ value }: IntValueNode) => {
    return value;
  },
  ListType: ({ type }: ListTypeNode) => {
    return {
      ...type,
      isList: true,
    };
  },
  ListValue: ({ values }: ListValueNode) => {
    return values;
  },
  Name: ({ value }: NameNode) => {
    return value;
  },
  NamedType: ({ name }: NamedTypeNode) => {
    return {
      isList: false,
      isNull: true,
      type: name,
    };
  },
  NonNullType: ({ type }: NonNullTypeNode) => {
    return {
      ...type,
      isNull: false,
    };
  },
  NullValue: () => {
    return "null";
  },
  ObjectField: (node: ObjectFieldNode) => {
    return node;
  },
  ObjectValue: ({ fields }: ObjectValueNode) => {
    return fields;
  },
  OperationType: (node: OperationTypeNode) => {
    return node.toString();
  },
  OperationTypeDefinition: (node: OperationTypeDefinitionNode) => {
    return node;
  },
  StringValue: ({ value }: StringValueNode) => {
    return value;
  },
  TypeDefinition: (node: TypeDefinitionNode) => {
    return node;
  },
} as const;

const OperationTypes: readonly string[] = [
  OPERATION_TYPE.QUERY,
  OPERATION_TYPE.MUTATION,
  OPERATION_TYPE.SUBSCRIPTION,
] as const;

const isNodeTypeOperation = (
  node: ASTNode | ParsedNode
): node is ObjectTypeDefinitionNode => {
  return (
    "name" in node &&
    typeof node.name !== "undefined" &&
    OperationTypes.includes(node.name.toString()) &&
    "fields" in node
  );
};

export const getSimplifiedNodeKind = (node: ASTNode | ParsedNode): string => {
  const kind = "operation" in node ? node.operation : node.kind;
  return SIMPLIFIED_NODE_KIND[kind] ?? node.kind;
};

export const parseSchema = (schema: DocumentNode): ParsedNode[] => {
  const nodes: ASTNode[] = visit(schema, { leave: visitor });
  return nodes.flatMap((node) => {
    if (isNodeTypeOperation(node) && typeof node.fields !== "undefined") {
      return node.fields.map<ParsedNode>((operation: FieldDefinitionNode) => {
        const parsedNode = {
          ...operation,
          kind: GRAPHQL_KIND.OperationTypeDefinition,
          operation: node.name,
        } as unknown as ParsedNode;
        return {
          ...parsedNode,
          simplifiedKind: getSimplifiedNodeKind(parsedNode),
        } as ParsedNode;
      });
    }
    return {
      ...node,
      simplifiedKind: getSimplifiedNodeKind(node),
    } as ParsedNode;
  });
};
