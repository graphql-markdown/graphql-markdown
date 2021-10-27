const { convertArrayToObject } = require("../utils/array");
module.exports = class CategoryInfo {
  constructor(
    rootTypes,
    linkRoot,
    baseURL,
    groupByDirective
  ) {
    this.rootTypes = rootTypes;
    this.linkRoot = linkRoot;
    this.baseURL = baseURL;
    this.groupByDirective = groupByDirective;
    this.group = {};
    if (this.groupByDirective) {
      this.setUpCategorizationInfo();
    }
  }
  setUpCategorizationInfo() {
    let allDirectves;
    Object.keys(this.rootTypes).forEach((typeName) => {
      if (this.rootTypes[typeName]) {
        if (Array.isArray(this.rootTypes[typeName])) {
          this.rootTypes[typeName] = convertArrayToObject(
            this.rootTypes[typeName],
          );
        }
        Object.keys(this.rootTypes[typeName]).forEach((name) => {
          if (this.rootTypes[typeName][name]["astNode"]) {
            allDirectves =
              this.rootTypes[typeName][name]["astNode"]["directives"];
          }
          this.group[name] = this.getGroup(allDirectves);
        });
      }
    });
  }
  getGroup(allDirectives) {
    if (typeof allDirectives === "undefined" || allDirectives === null) {
      return this.groupByDirective.fallback;
    }
    let categoryInDirective
    allDirectives.forEach((directive) => {
      if (
        directive.name.value === this.groupByDirective.directive
      ) {
        const field = directive.arguments.filter( ({ name }) => name.value === this.groupByDirective.field);
        categoryInDirective = field[0].value.value;
      }
    });
    return categoryInDirective || this.groupByDirective.fallback;
  }
};
