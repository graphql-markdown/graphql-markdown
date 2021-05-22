export default {
  kind: "InputObjectTypeDefinition",
  name: "TweetContent",
  directives: [],
  fields: [
    {
      type: "String",
      isNull: true,
      isList: false,
      name: "content",
      directives: [],
      kind: "InputValueDefinition",
    },
    {
      type: "String",
      isNull: true,
      isList: false,
      name: "body",
      directives: [],
      kind: "InputValueDefinition",
    },
  ],
};
