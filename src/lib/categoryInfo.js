const { convertArrayToObject } = require("../utils/array");
module.exports = class CategoryInfo {
  constructor(
    rootTypes,
    directiveToGroupBy,
    directiveFieldForGrouping,
    linkRoot,
    baseURL,
    fallbackCategory,
  ) {
    this.rootTypes = rootTypes;
    this.directiveToGroupBy = directiveToGroupBy;
    this.directiveFieldForGrouping = directiveFieldForGrouping;
    this.linkRoot = linkRoot;
    this.group = {};
    this.fallbackCategory = fallbackCategory;
    this.baseURL = baseURL;
    if (this.directiveToGroupBy) {
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
      return this.fallbackCategory;
    }
    let categoryInDirective;
    allDirectives.forEach((directive) => {
      if (
        directive.name.value === this.directiveToGroupBy &&
        directive.arguments.length > 0
      ) {
        directive.arguments.forEach((argument) => {
          if (argument.name.value === this.directiveFieldForGrouping) {
            categoryInDirective = argument.value.value;
          }
        });
      }
    });
    return categoryInDirective || this.fallbackCategory;
  }
};
