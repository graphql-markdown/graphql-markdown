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
  "query",
  "mutation",
  "subscription",
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
          kind: "OperationTypeDefinition",
          operation: node.name.toString().toLowerCase(),
        } as unknown as ParsedNode;
      });
    }
    return node as unknown as ParsedNode;
  });
};

export const getSimplifiedNodeKind = (node: ParsedNode): string => {
  switch (node.kind) {
    case "OperationTypeDefinition":
      return node.operation;
    case "DirectiveDefinition":
      return "Directive";
    case "ScalarTypeDefinition":
    case "EnumTypeDefinition":
    case "InputTypeDefinition":
    case "InterfaceTypeDefinition":
    case "ObjectTypeDefinition":
    case "UnionTypeDefinition":
      return node.kind.replace(/^(?<kind>[A-z]+)TypeDefinition$/, "$<kind>");
    case "InputObjectTypeDefinition":
      return "Input";
    default:
      return "Object";
  }
};
