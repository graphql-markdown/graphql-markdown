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
  DIRECTIVE: "DirectiveDefinition",
  ENUM_TYPE: "EnumTypeDefinition",
  INPUT_OBJECT_TYPE: "InputObjectTypeDefinition",
  INPUT_TYPE: "InputTypeDefinition",
  INTERFACE_TYPE: "InterfaceTypeDefinition",
  OBJECT_TYPE: "ObjectTypeDefinition",
  OPERATION_TYPE: "OperationTypeDefinition",
  SCALAR_TYPE: "ScalarTypeDefinition",
  UNION_TYPE: "UnionTypeDefinition",
} as const;

const SIMPLIFIED_NODE_KIND = {
  DIRECTIVE: "Directive",
  INPUT: "Input",
  OBJECT: "Object",
} as const;

const OPERATION_TYPE = {
  MUTATION: "mutation",
  QUERY: "query",
  SUBSCRIPTION: "subscription",
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
  node: ASTNode
): node is ObjectTypeDefinitionNode => {
  return (
    "name" in node &&
    typeof node.name !== "undefined" &&
    OperationTypes.includes(node.name.toString().toLowerCase()) &&
    "fields" in node
  );
};

export const parseSchema = (schema: DocumentNode): ParsedNode[] => {
  const nodes: ASTNode[] = visit(schema, { leave: visitor });
  return nodes.flatMap((node) => {
    if (isNodeTypeOperation(node) && typeof node.fields !== "undefined") {
      return node.fields.map<ParsedNode>((operation: FieldDefinitionNode) => {
        return {
          ...operation,
          kind: GRAPHQL_KIND.OPERATION_TYPE,
          operation: node.name.toString().toLowerCase(),
        } as unknown as ParsedNode;
      });
    }
    return node as unknown as ParsedNode;
  });
};

export const getSimplifiedNodeKind = (node: ParsedNode): string => {
  switch (node.kind) {
    case GRAPHQL_KIND.OPERATION_TYPE:
      return node.operation;
    case GRAPHQL_KIND.DIRECTIVE:
      return SIMPLIFIED_NODE_KIND.DIRECTIVE;
    case GRAPHQL_KIND.SCALAR_TYPE:
    case GRAPHQL_KIND.ENUM_TYPE:
    case GRAPHQL_KIND.INPUT_TYPE:
    case GRAPHQL_KIND.INTERFACE_TYPE:
    case GRAPHQL_KIND.OBJECT_TYPE:
    case GRAPHQL_KIND.UNION_TYPE:
      return node.kind.replace(/^(?<kind>[A-z]+)TypeDefinition$/, "$<kind>");
    case GRAPHQL_KIND.INPUT_OBJECT_TYPE:
      return SIMPLIFIED_NODE_KIND.INPUT;
    default:
      return SIMPLIFIED_NODE_KIND.OBJECT;
  }
};
