const { getTypeDirectiveValues } = require("./graphql");
const { interpolate } = require("./string");

function directiveDescriptor(
  directiveType,
  type,
  descriptionTemplate = undefined,
) {
  const values = getTypeDirectiveValues(directiveType, type);
  if (typeof descriptionTemplate !== "string") {
    return interpolate(directiveType.description || "", values);
  }
  return interpolate(descriptionTemplate, values);
}

function directiveTag(
  directiveType,
  type,
  classname = "badge badge--secondary",
) {
  return {
    text: `@${directiveType.name}`,
    classname: classname,
  };
}

module.exports = { directiveDescriptor, directiveTag };
