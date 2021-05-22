export default {
  kind: "ObjectTypeDefinition",
  name: "Subscription",
  interfaces: [],
  directives: [],
  fields: [
    {
      type: "Notification",
      isNull: false,
      isList: true,
      name: "Notifications",
      arguments: [
        {
          type: "Int",
          isNull: true,
          isList: false,
          name: "limit",
          directives: [],
          kind: "InputValueDefinition",
        },
      ],
      directives: [],
      kind: "FieldDefinition",
    },
  ],
};
