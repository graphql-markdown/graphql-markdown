import {
  ArgumentNode,
  BooleanValueNode,
  DirectiveDefinitionNode,
  DirectiveNode,
  DocumentNode,
  EnumTypeDefinitionNode,
  EnumValueNode,
  FieldDefinitionNode,
  FloatValueNode,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InterfaceTypeDefinitionNode,
  IntValueNode,
  ListTypeNode,
  ListValueNode,
  NamedTypeNode,
  NameNode,
  NonNullTypeNode,
  NullValueNode,
  ObjectFieldNode,
  ObjectTypeDefinitionNode,
  ObjectValueNode,
  ScalarTypeDefinitionNode,
  StringValueNode
} from "graphql";

export const visitor: any = {
  leave: {
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
    IntValue: ({ value }: IntValueNode) => value,
    FloatValue: ({ value }: FloatValueNode) => value,
    BooleanValue: ({ value }: BooleanValueNode) => value,
    NullValue: (_: NullValueNode) => "null",
    EnumValue: ({ value }: EnumValueNode) => value,
    ListValue: ({ values }: ListValueNode) => values,
    ObjectValue: ({ fields }: ObjectValueNode) => fields,
    ObjectField: ({ name, value }: ObjectFieldNode) => {
      return { name, value };
    },
    InputValueDefinition: ({
      type,
      name,
      directives,
      defaultValue,
      kind,
      description
    }: InputValueDefinitionNode) => {
      return {
        ...type,
        name,
        directives,
        defaultValue,
        kind,
        description: description
      };
    },
    FieldDefinition: ({
      type,
      name,
      arguments: args,
      directives,
      kind,
      description
    }: FieldDefinitionNode) => {
      return {
        ...type,
        name,
        arguments: args,
        directives,
        kind,
        description: description
      };
    },
    ObjectTypeDefinition: ({
      name,
      fields,
      directives,
      interfaces,
      kind,
      description
    }: ObjectTypeDefinitionNode) => {
      return {
        name,
        fields,
        directives,
        interfaces,
        description: description,
        kind,
      };
    },
    InputObjectTypeDefinition: ({ name, fields, kind }: InputObjectTypeDefinitionNode) => {
      return {
        name,
        fields,
        kind,
      };
    },
    EnumTypeDefinition: ({ name, description, directives, values, kind }: EnumTypeDefinitionNode) => {
      return { name, description: description, directives: directives, values, kind };
    },
    ScalarTypeDefinition: ({ name, description, kind, directives }: ScalarTypeDefinitionNode) => {
      return { name, description: description, kind, directives: [...directives] };
    },
    InterfaceTypeDefinition: ({
      name,
      fields,
      interfaces,
      directives,
      description,
      kind
    }: InterfaceTypeDefinitionNode) => {
      return {
        name,
        fields,
        kind,
        interfaces,
        directives,
        description: description,
      };
    },
    StringValue: ({ value }: StringValueNode) => {
      return value;
    },
    Directive: ({ name, arguments: args }: DirectiveNode) => {
      return {
        name,
        arguments: args
      };
    },
    DirectiveDefinition: ({
      name,
      arguments: args,
      repeatable,
      description,
      kind
    }: DirectiveDefinitionNode) => {
      return {
        name,
        arguments: args,
        repeatable,
        description: description,
        kind
      };
    },
    Argument: ({ name, value }: ArgumentNode) => {
      return {
        name,
        value
      };
    },
  },
};
