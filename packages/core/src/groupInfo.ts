import { convertArrayToObject } from "@graphql-markdown/utils/array";
import { GroupByDirective } from "./type";

const DEFAULT_GROUP: string = "Miscellaneous";
const OPTION_REGEX: RegExp =
  /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

export const parseGroupByOption = (
  groupOptions?: string
): GroupByDirective | undefined => {
  if (typeof groupOptions !== "string" || groupOptions === null) {
    return undefined;
  }

  const parsedOptions = OPTION_REGEX.exec(groupOptions);

  if (
    typeof parsedOptions === "undefined" ||
    parsedOptions === null ||
    typeof parsedOptions.groups === undefined
  ) {
    throw new Error(`Invalid "${groupOptions}"`);
  }

  const {
    directive,
    field,
    fallback = DEFAULT_GROUP,
  } = parsedOptions.groups as GroupByDirective;
  return { directive, field, fallback };
};

export const getGroups = (
  rootTypes: any,
  groupByDirective: GroupByDirective | undefined
): Record<string, unknown> | undefined => {
  if (typeof groupByDirective === "undefined" || groupByDirective == null) {
    return undefined;
  }

  let groups: Record<string, unknown> = {};

  Object.keys(rootTypes).forEach((typeName) => {
    let rootType = rootTypes[typeName];
    if (typeof rootType != "undefined" && rootType != null) {
      if (Array.isArray(rootType)) {
        rootType = convertArrayToObject(rootType);
      }

      Object.keys(rootType).forEach((type) => {
        groups[type] = getGroupName(rootType[type], groupByDirective);
      });
    }
  });

  return groups;
};

export const getGroupName = (
  type: any,
  groupByDirective: GroupByDirective
): string => {
  let group: string = groupByDirective.fallback as string; // default value is fallback, and it will be only overridden if a group is found

  if (typeof type.astNode === "undefined" || type.astNode == null) {
    return group;
  }

  const allDirectives = type.astNode.directives;

  if (!Array.isArray(allDirectives)) {
    return group;
  }

  for (const directive of allDirectives) {
    if (directive.name.value !== groupByDirective.directive) {
      continue;
    }
    const field = directive.arguments.find(
      ({ name }: any) => name.value === groupByDirective.field
    );
    return field.value.value;
  }

  return group;
};
