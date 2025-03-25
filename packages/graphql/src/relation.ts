/**
 * Library supporting `relatedTypeSection` for displaying relations between GraphQL schema entities.
 *
 * @see [Option `relatedTypeSection`](https://graphql-markdown.dev/docs/settings#printtypeoptions)
 *
 * @packageDocumentation
 */

import type { GraphQLUnionType } from "graphql";
import {
  getNamedType,
  isDirective as isDirectiveType,
  isInterfaceType,
  isNamedType,
  isObjectType,
  isUnionType,
} from "graphql";

import type {
  GraphQLOperationType,
  GraphQLType,
  IGetRelation,
  Maybe,
  RelationOfField,
  RelationOfImplementation,
  RelationOfInterface,
  SchemaEntity,
  SchemaMap,
} from "@graphql-markdown/types";

import { toString } from "@graphql-markdown/utils";

import { _getFields } from "./introspection";
import { isGraphQLFieldType } from "./guard";

/**
 * Callback type used by {@link mapRelationOf}.
 */
type RelationOfCallbackFunction<T> = (
  type: unknown,
  relationName: string,
  relationType: T,
  results: T[],
) => T[];

/**
 * Generic method for fetching relations for a given GraphQL schema type.
 *
 * @internal
 *
 * @typeParam T - the type of the relation.
 *
 * @param type - the GraphQL schema type being processed.
 * @param relations - the map of relations to be returned.
 * @param schemaMap - a GraphQL schema map (see {@link introspection!getSchemaMap}).
 * @param callback - a function to execute for each entries of the schema map.
 *
 * @returns a record map of type `relations`.
 *
 */
const mapRelationOf = <
  T,
  R extends ReturnType<IGetRelation<T>> = ReturnType<IGetRelation<T>>,
>(
  type: unknown,
  relations: R,
  schemaMap: Maybe<SchemaMap>,
  callback: RelationOfCallbackFunction<T>,
): R => {
  if (!schemaMap) {
    return {} as R;
  }

  for (const relation of Object.keys(relations)) {
    const entity: Maybe<Record<SchemaEntity, T>> = schemaMap[
      relation as SchemaEntity
    ] as Maybe<Record<SchemaEntity, T>>;
    if (!entity) {
      continue;
    }

    let results: T[] = [];
    for (const [relationName, relationType] of Object.entries<T>(entity)) {
      results = callback(type, relationName, relationType, results);
    }
    relations[relation as keyof R] = results as R[keyof R];
  }

  return relations;
};

/**
 * Returns a map of operations (queries, mutations, subscriptions) where the GraphQL schema type is the return type.
 *
 * @see {@link mapRelationOf}
 *
 * @typeParam T - the type of the GraphQL schema type.
 * @typeParam R - the return type of map of relations (see {@link IGetRelation}).
 *
 * @param type - the GraphQL schema type being processed.
 * @param schemaMap - a GraphQL schema map (see {@link introspection!getSchemaMap}).
 *
 * @returns a record map of operations relations.
 *
 */
export const getRelationOfReturn: IGetRelation<GraphQLOperationType> = (
  type: unknown,
  schemaMap: Maybe<SchemaMap>,
) => {
  const relations: ReturnType<IGetRelation<GraphQLOperationType>> = {
    queries: [],
    mutations: [],
    subscriptions: [],
  };

  const parserCallback: RelationOfCallbackFunction<GraphQLOperationType> = (
    type,
    relationName,
    relationType,
    results,
  ) => {
    if (
      typeof relationType === "object" &&
      isNamedType(type) &&
      "type" in relationType &&
      getNamedType(relationType.type as unknown as Maybe<GraphQLType>)?.name ===
        type.name
    ) {
      if (
        !results.find((r: unknown) => {
          return (
            typeof r === "object" &&
            r !== null &&
            "name" in r &&
            r.name === relationName
          );
        })
      ) {
        results.push(relationType);
      }
    }
    return results;
  };

  return mapRelationOf<GraphQLOperationType>(
    type,
    relations,
    schemaMap,
    parserCallback,
  );
};

/**
 * Returns a map of fields and arguments where the GraphQL schema type matches the type.
 *
 * @see {@link mapRelationOf}
 *
 * @typeParam T - the type of the GraphQL schema type.
 * @typeParam R - the return type of map of relations (see {@link IGetRelation}).
 *
 * @param type - the GraphQL schema type being processed.
 * @param schemaMap - a GraphQL schema map (see {@link introspection!getSchemaMap}).
 *
 * @returns a record map of fields and arguments relations.
 *
 */
export const getRelationOfField: IGetRelation<RelationOfField> = <T>(
  type: T,
  schemaMap: Maybe<SchemaMap>,
) => {
  const relations: ReturnType<IGetRelation<RelationOfField>> = {
    queries: [],
    mutations: [],
    subscriptions: [],
    objects: [],
    interfaces: [],
    inputs: [],
    directives: [],
  };

  const parserCallback: RelationOfCallbackFunction<RelationOfField> = (
    type,
    relationName,
    relationType,
    results,
  ) => {
    // directives are handled as flat array instead of map
    const key = isDirectiveType(relationType)
      ? relationType.name
      : relationName;

    const paramFieldArgs = isGraphQLFieldType(relationType)
      ? relationType.args
      : {};
    const fieldMap = _getFields(relationType, undefined, {});

    const fields = Object.assign({}, paramFieldArgs, fieldMap);
    for (const fieldDef of Object.values(fields)) {
      if (
        isNamedType(type) &&
        getNamedType(fieldDef.type as Maybe<GraphQLType>)?.name === type.name
      ) {
        if (
          !results.find((r) => {
            return (
              toString(r) === key ||
              (typeof r === "object" && "name" in r && r.name === key)
            );
          })
        ) {
          results.push(relationType);
        }
      }
    }
    return results;
  };

  return mapRelationOf<RelationOfField>(
    type,
    relations,
    schemaMap,
    parserCallback,
  );
};

/**
 * Returns a map of unions where the GraphQL schema type is part of it.
 *
 * @see {@link mapRelationOf}
 *
 * @typeParam T - the type of the GraphQL schema type.
 * @typeParam R - the return type of map of relations (see {@link IGetRelation}).
 *
 * @param type - the GraphQL schema type being processed.
 * @param schemaMap - a GraphQL schema map (see {@link introspection!getSchemaMap}).
 *
 * @returns a record map of unions relations.
 *
 */
export const getRelationOfUnion: IGetRelation<GraphQLUnionType> = <T>(
  type: T,
  schemaMap: Maybe<SchemaMap>,
) => {
  const relations: ReturnType<IGetRelation<GraphQLUnionType>> = {
    unions: [],
  };

  const parserCallback: RelationOfCallbackFunction<GraphQLUnionType> = (
    type,
    relationName,
    relationType,
    results,
  ) => {
    if (
      isNamedType(type) &&
      isUnionType(relationType) &&
      relationType.getTypes().find((subType) => {
        return subType.name === type.name;
      })
    ) {
      if (
        !results.find((r) => {
          return (
            typeof r === "object" && "name" in r && r.name === relationName
          );
        })
      ) {
        results.push(relationType);
      }
    }
    return results;
  };

  return mapRelationOf<GraphQLUnionType>(
    type,
    relations,
    schemaMap,
    parserCallback,
  );
};

/**
 * Returns a map of interfaces where the GraphQL schema type is extended.
 *
 * @see {@link mapRelationOf}
 *
 * @typeParam T - the type of the GraphQL schema type.
 * @typeParam R - the return type of map of relations (see {@link IGetRelation}).
 *
 * @param type - the GraphQL schema type being processed.
 * @param schemaMap - a GraphQL schema map (see {@link introspection!getSchemaMap}).
 *
 * @returns a record map of interfaces relations.
 *
 */
export const getRelationOfInterface: IGetRelation<RelationOfInterface> = <T>(
  type: T,
  schemaMap: Maybe<SchemaMap>,
): Record<string, RelationOfInterface[]> => {
  const relations: ReturnType<IGetRelation<RelationOfInterface>> = {
    objects: [],
    interfaces: [],
  };

  const parserCallback: RelationOfCallbackFunction<RelationOfInterface> = (
    type,
    relationName,
    relationType,
    results,
  ) => {
    if (
      isNamedType(type) &&
      (isObjectType(relationType) || isInterfaceType(relationType)) &&
      relationType.getInterfaces().find((subType) => {
        return subType.name === type.name;
      })
    ) {
      if (
        !results.find((r) => {
          return (
            typeof r === "object" && "name" in r && r.name === relationName
          );
        })
      ) {
        results.push(relationType);
      }
    }
    return results;
  };

  return mapRelationOf<RelationOfInterface>(
    type,
    relations,
    schemaMap,
    parserCallback,
  );
};

/**
 * Returns a map of types (unions or interfaces) where the GraphQL schema type is implemented.
 *
 * @see {@link mapRelationOf}
 *
 * @typeParam T - the type of the GraphQL schema type.
 * @typeParam R - the return type of map of relations (see {@link IGetRelation}).
 *
 * @param type - the GraphQL schema type being processed.
 * @param schemaMap - a GraphQL schema map (see {@link introspection!getSchemaMap}).
 *
 * @returns a record map of unions or interfaces relations.
 *
 */
export const getRelationOfImplementation: IGetRelation<
  RelationOfImplementation
> = <T>(type: T, schemaMap: Maybe<SchemaMap>) => {
  return {
    ...getRelationOfInterface(type, schemaMap),
    ...getRelationOfUnion(type, schemaMap),
  };
};
