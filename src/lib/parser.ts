import {
  visit,
  ArgumentNode,
  BooleanValueNode,
  DirectiveDefinitionNode,
  DocumentNode,
  EnumValueNode,
  FieldDefinitionNode,
  FloatValueNode,
  InputValueDefinitionNode,
  IntValueNode,
  ListTypeNode,
  ListValueNode,
  NamedTypeNode,
  NameNode,
  NonNullTypeNode,
  NullValueNode,
  ObjectFieldNode,
  ObjectValueNode,
  StringValueNode,
  TypeDefinitionNode,
} from "graphql";

const visitor = {
  Document: ({ definitions }: DocumentNode) => definitions,
  Name: ({ value }: NameNode) => value,
  NamedType: ({ name }: NamedTypeNode) => {
    return {
      type: name,
      isNull: true,
      isList: false,
    };
  },
  NonNullType: ({ type }: NonNullTypeNode) => {
    return {
      ...type,
      isNull: false,
    };
  },
  ListType: ({ type }: ListTypeNode) => {
    return {
      ...type,
      isList: true,
    };
  },
  StringValue: ({ value }: StringValueNode) => value,
  IntValue: ({ value }: IntValueNode) => value,
  FloatValue: ({ value }: FloatValueNode) => value,
  BooleanValue: ({ value }: BooleanValueNode) => value,
  NullValue: (_: NullValueNode) => "null",
  EnumValue: ({ value }: EnumValueNode) => value,
  ListValue: ({ values }: ListValueNode) => values,
  ObjectValue: ({ fields }: ObjectValueNode) => fields,
  ObjectField: (node: ObjectFieldNode) => node,
  TypeSystemDefinitionNode: (
    node: TypeDefinitionNode | DirectiveDefinitionNode
  ) => node,
  Argument: (node: ArgumentNode) => node,
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
      name,
      directives,
      defaultValue,
      kind,
      description: description,
    };
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
      name,
      arguments: args,
      directives,
      kind,
      description: description,
    };
  },
};

export const parseSchema = (schema: DocumentNode): any => {
  return visit(schema, { leave: visitor });
};
