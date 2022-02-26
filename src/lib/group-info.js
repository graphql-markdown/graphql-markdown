const { convertArrayToObject } = require("../utils/scalars/array");
module.exports = class GroupInfo {
  constructor(rootTypes, groupByDirective) {
    this.group = undefined;
    if (groupByDirective) {
      this.groupByDirective = groupByDirective;
      this.group = {};
      this.generateGroupInfo(rootTypes);
    }
  }
  generateGroupInfo(rootTypes) {
    let allDirectives;
    Object.keys(rootTypes).forEach((typeName) => {
      if (rootTypes[typeName]) {
        if (Array.isArray(rootTypes[typeName])) {
          rootTypes[typeName] = convertArrayToObject(rootTypes[typeName]);
        }
        Object.keys(rootTypes[typeName]).forEach((name) => {
          if (rootTypes[typeName][name]["astNode"]) {
            allDirectives = rootTypes[typeName][name]["astNode"]["directives"];
          }
          this.group[name] = this.getGroup(allDirectives);
        });
      }
    });
  }

  getGroup(allDirectives) {
    let group = this.groupByDirective.fallback; // default value is fallback, and it will be only overridden if a group is found

    if (typeof allDirectives === "undefined" || allDirectives === null) {
      return group;
    }

    allDirectives.forEach((directive) => {
      if (directive.name.value === this.groupByDirective.directive) {
        const field = directive.arguments.find(
          ({ name }) => name.value === this.groupByDirective.field,
        );
        group = field.value.value;
      }
    });

    return group;
  }
  static parseOption(groupByDirective) {
    if (typeof groupByDirective !== "string") {
      return undefined;
    }

    const regex =
      /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

    const parsed = regex.exec(groupByDirective);
    if (parsed) {
      const { directive, field, fallback = "Miscellaneous" } = parsed.groups;
      return { directive, field, fallback };
    } else {
      throw new Error(`Invalid "${groupByDirective}"`);
    }
  }
};
