const { convertArrayToObject } = require("../utils/scalars/array");
module.exports = class GroupingInfo {
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
    if (typeof allDirectives === "undefined" || allDirectives === null) {
      return this.groupByDirective.fallback;
    }
    let groupInDirective;
    allDirectives.forEach((directive) => {
      if (directive.name.value === this.groupByDirective.directive) {
        const field = directive.arguments.filter(
          ({ name }) => name.value === this.groupByDirective.field,
        );
        groupInDirective = field[0].value.value;
      }
    });
    return groupInDirective || this.groupByDirective.fallback;
  }
  parseOptionGroupByDirective(groupByDirective) {
    const regex =
      /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

    if (typeof groupByDirective !== "string") {
      return undefined;
    }

    const parsed = regex.exec(groupByDirective);
    if (parsed) {
      const { directive, field, fallback = "Miscellaneous" } = parsed.groups;
      return { directive, field, fallback };
    } else {
      throw new Error(`Invalid "${groupByDirective}"`);
    }
  }
};
