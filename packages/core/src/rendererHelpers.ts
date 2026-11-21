import type {
  ApiGroupOverrideType,
  Maybe,
  RendererDocOptions,
  TypeHierarchyObjectType,
  TypeHierarchyValueType,
} from "@graphql-markdown/types";
import { isApiType } from "@graphql-markdown/graphql";
import { isGroupsObject } from "./directives/validation.ts";

/** Constant for deprecated entity grouping */
export const DEPRECATED = "deprecated" as const;

/** Category CSS classes */
export enum CATEGORY_STYLE_CLASS {
  API = "graphql-markdown-api-section",
  DEPRECATED = "graphql-markdown-deprecated-section",
}

/** Sidebar order */
export enum SidebarPosition {
  FIRST = 1,
  LAST = 999,
}

/** Default API groups */
export const API_GROUPS: Required<ApiGroupOverrideType> = {
  operations: "operations",
  types: "types",
} as const;

/** Determine folder for a type */
export const getApiGroupFolder = (
  type: unknown,
  groups?: Maybe<ApiGroupOverrideType | boolean>,
): string => {
  let folderNames = API_GROUPS;
  if (isGroupsObject(groups)) folderNames = { ...API_GROUPS, ...groups };
  return isApiType(type) ? folderNames.operations : folderNames.types;
};

/** Strip numeric prefix from folder names */
export const stripNumericPrefix = (folderName: string): string => {
  return folderName.replace(/^\d{2}-/, "");
};

/** Check hierarchy */
export const isHierarchy = (
  options: Maybe<RendererDocOptions>,
  hierarchy: TypeHierarchyValueType,
): options is RendererDocOptions & { hierarchy: TypeHierarchyObjectType } => {
  return options?.hierarchy?.[hierarchy] !== undefined;
};
