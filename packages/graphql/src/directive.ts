/**
 * Library supporting `customDirective` for directive based customization.
 *
 * @see [Option `customDirective`](https://graphql-markdown.dev/docs/advanced/custom-directive)
 *
 * @packageDocumentation
 */

import type {
  DirectiveName,
  CustomDirective,
  CustomDirectiveMap,
  CustomDirectiveOptions,
  Maybe,
  SchemaMap,
  CustomDirectiveMapItem,
} from "@graphql-markdown/types";

import { isEmpty } from "@graphql-markdown/utils";

import { getDirective } from "./introspection";

/**
 * Wildcard `*` character for matching any directive name.
 *
 * See {@link getCustomDirectiveOptions}, {@link isCustomDirective}
 *
 */
export const WILDCARD_DIRECTIVE = "*" as const;

/**
 * Checks if a directive name is referenced in `customDirective` option.
 *
 * @param schemaDirectiveName - the GraphQL directive name.
 * @param customDirectiveOptions - the `customDirective` option.
 *
 * @returns `true` if the directive is declared or `*` is declared in `customDirective` option, else `false`.
 *
 */
export const isCustomDirective = (
  schemaDirectiveName: DirectiveName,
  customDirectiveOptions: CustomDirective,
): boolean => {
  return (
    schemaDirectiveName in customDirectiveOptions ||
    WILDCARD_DIRECTIVE in customDirectiveOptions
  );
};

/**
 * Returns a record set of custom handlers from a directive by name.
 *
 * @param schemaDirectiveName - the GraphQL directive name.
 * @param customDirectiveOptions - the `customDirective` option.
 *
 * @returns a record set of custom handlers for the matching directive (or if `*` is declared), or `undefined` if no match.
 *
 * @example
 * ```js
 * import { getCustomDirectiveOptions } from "@graphql-markdown/utils/directive";
 *
 * const customDirectiveOptions = {
 *   "*": {
 *     descriptor: (_, constDirectiveType) => `Wildcard ${constDirectiveType.name}`;
 *   },
 * };
 *
 * const customDirectives = getCustomDirectiveOptions("testB", customDirectiveOptions);
 *
 * // Expected result: {
 * //   "descriptor": (_, constDirectiveType) => `Wildcard ${constDirectiveType.name}`,
 * //   "type": "@testB",
 * // }
 * ```
 *
 */
export const getCustomDirectiveOptions = (
  schemaDirectiveName: DirectiveName,
  customDirectiveOptions: CustomDirective,
): Maybe<CustomDirectiveOptions> => {
  if (schemaDirectiveName in customDirectiveOptions) {
    return customDirectiveOptions[schemaDirectiveName];
  }

  if (WILDCARD_DIRECTIVE in customDirectiveOptions) {
    return customDirectiveOptions[WILDCARD_DIRECTIVE as DirectiveName];
  }

  return undefined;
};

/**
 * Returns a custom directives map with custom handlers from `customDirective`.
 *
 * @param schemaMap - the GraphQL schema map returned by {@link getSchemaMap}
 * @param customDirectiveOptions - the `customDirective` option.
 *
 * @returns a custom directive map, or `undefined` if no match.
 *
 * @example
 * ```js
 * import { buildSchema } from "graphql";
 * import { getCustomDirectives } from "@graphql-markdown/utils/directive";
 *
 * const schema = buildSchema(`
 *   directive @testA(
 *     arg: ArgEnum = ARGA
 *   ) on OBJECT | FIELD_DEFINITION
 *   directive @testB(
 *     argA: Int!,
 *     argB: [String!]
 *   ) on FIELD_DEFINITION
 *   enum ArgEnum {
 *     ARGA
 *     ARGB
 *     ARGC
 *   }
 * `);
 *
 * const schemaMap = {
 *   directives: {
 *     testA: schema.getDirective("testA"),
 *     testB: schema.getDirective("testB"),
 *   },
 * };
 *
 * const customDirectiveOptions = {
 *   testA: {
 *     descriptor: (_, constDirectiveType) => `Named directive ${constDirectiveType.name}`;
 *   },
 *   "*": {
 *     descriptor: (_, constDirectiveType) => `Wildcard ${constDirectiveType.name}`;
 *   },
 * };
 *
 * const customDirectives = getCustomDirectives(schemaMap, customDirectiveOptions);
 *
 * // Expected result: {
 * //   "testA": {
 * //     "descriptor": (_, constDirectiveType) => `Named directive ${constDirectiveType.name}`,
 * //     "type": "@testA",
 * //   },
 * //   "testB": {
 * //     "descriptor": (_, constDirectiveType) => `Wildcard ${constDirectiveType.name}`,
 * //     "type": "@testB",
 * //   },
 * // }
 * ```
 *
 */
export const getCustomDirectives = (
  { directives: schemaDirectives }: Pick<SchemaMap, "directives">,
  customDirectiveOptions?: Maybe<CustomDirective>,
): Maybe<CustomDirectiveMap> => {
  const customDirectives: CustomDirectiveMap = {};

  if (
    !customDirectiveOptions ||
    typeof schemaDirectives !== "object" ||
    typeof customDirectiveOptions !== "object"
  ) {
    return undefined;
  }

  for (const schemaDirectiveName in schemaDirectives) {
    if (
      !isCustomDirective(
        schemaDirectiveName as DirectiveName,
        customDirectiveOptions,
      )
    ) {
      continue;
    }

    const directiveOptions = getCustomDirectiveOptions(
      schemaDirectiveName as DirectiveName,
      customDirectiveOptions,
    );

    if (typeof directiveOptions !== "object") {
      continue;
    }

    customDirectives[schemaDirectiveName as DirectiveName] = {
      type: schemaDirectives[schemaDirectiveName as DirectiveName],
      ...directiveOptions,
    };
  }

  return isEmpty(customDirectives) ? undefined : customDirectives;
};

/**
 * Returns a map of custom directives for a schema entity.
 *
 * @param entity - a GraphQL schema entity.
 * @param customDirectiveMap - a custom directive map (see {@link getCustomDirectives}).
 *
 * @returns A map of GraphQL directives matching the custom directives defined, else `undefined`.
 *
 * @example
 * ```js
 * import { buildSchema } from "graphql";
 * import { getConstDirectiveMap } from "@graphql-markdown/utils/directive";
 *
 * const schema = buildSchema(`
 *     directive @testA(
 *       arg: ArgEnum = ARGA
 *     ) on OBJECT | FIELD_DEFINITION
 *
 *     directive @testB(
 *       argA: Int!,
 *       argB: [String!]
 *     ) on FIELD_DEFINITION
 *
 *     enum ArgEnum {
 *       ARGA
 *       ARGB
 *       ARGC
 *     }
 *
 *     type Test @testA {
 *       id: ID!
 *       fieldA: [String!]
 *         @testA(arg: ARGC)
 *         @testB(argA: 10, argB: ["testArgB"])
 *     }
 *
 *     type TestWithoutDirective {
 *       id: ID!
 *     }
 *   `);
 *
 * const customDirectives = {
 *   testA: {
 *     type: schema.getDirective("testA"),
 *     descriptor: (_, constDirectiveType) => `${constDirectiveType.name}`;
 *   },
 * };
 *
 * const map = getConstDirectiveMap(schema.getType("Test"), customDirectives);
 * // Expected result: {
 * //   "descriptor": (_, constDirectiveType) => `${constDirectiveType.name}`,
 * //   "type": schema.getDirective("testA"),
 * // }
 *
 * ```
 */
export const getConstDirectiveMap = (
  entity: unknown,
  customDirectiveMap: Maybe<CustomDirectiveMap>,
): Maybe<CustomDirectiveMap> => {
  if (isEmpty(customDirectiveMap)) {
    return undefined;
  }

  const directiveList = Object.values<CustomDirectiveMapItem>(
    customDirectiveMap,
  ).map((directiveMapItem) => {
    return directiveMapItem.type;
  });

  const constDirectives = getDirective(entity, directiveList);
  if (constDirectives.length === 0) {
    return undefined;
  }

  return constDirectives.reduce<CustomDirectiveMap>(
    (directiveMap, constDirective) => {
      const name = constDirective.name as DirectiveName;
      directiveMap[name] = customDirectiveMap[name];
      return directiveMap;
    },
    {},
  );
};
