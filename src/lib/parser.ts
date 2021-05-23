import {
  ArgumentNode,
  BooleanValueNode,
  DirectiveDefinitionNode,
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
  ObjectValueNode,
  OperationTypeDefinitionNode,
  OperationTypeNode,
  StringValueNode,
  TypeDefinitionNode,
  visit,
} from "graphql";

const visitor = {
  Argument: (node: ArgumentNode) => {
    return node;
  },
  BooleanValue: ({ value }: BooleanValueNode) => {
    return value;
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
  TypeSystemDefinition: (
    node: DirectiveDefinitionNode | TypeDefinitionNode
  ) => {
    return node;
  },
};

export const parseSchema = (schema: DocumentNode): any => {
  return visit(schema, { leave: visitor });
};
