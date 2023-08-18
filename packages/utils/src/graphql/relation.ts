import type {
  GraphQLDirective,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLUnionType,
} from "graphql";
import {
  getNamedType,
  isDirective as isDirectiveType,
  isInterfaceType,
  isNamedType,
  isObjectType,
  isUnionType,
} from "graphql";

import type {
  GraphQLNamedType,
  GraphQLType,
  IGetRelation,
  Maybe,
  SchemaEntity,
  SchemaMap,
} from "@graphql-markdown/types";

import { getSchemaMap, __getFields } from "./introspection";
import { isGraphQLFieldType } from "./guard";

function mapRelationOf<T>(
  type: unknown,
  relations: Record<string, T[]>,
  schema: Maybe<GraphQLSchema>,
  callback: (
    type: unknown,
    relationName: string,
    relationType: unknown,
    results: T[],
  ) => T[],
): Record<string, T[]> {
  const schemaMap: SchemaMap = getSchemaMap(schema);

  for (const relation of Object.keys(relations)) {
    const entity: Maybe<Record<string, T>> = schemaMap[
      relation as SchemaEntity
    ] as Maybe<Record<string, T>>;
    if (!entity) {
      continue;
    }

    let results: T[] = [];
    for (const [relationName, relationType] of Object.entries<T>(entity)) {
      results = callback(type, relationName, relationType, results);
    }
    relations[relation] = results;
  }

  return relations;
}

export const getRelationOfReturn: IGetRelation<Record<string, unknown[]>> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<string, unknown[]> => {
  const relations: Partial<Record<SchemaEntity, unknown[]>> = {
    queries: [],
    mutations: [],
    subscriptions: [],
  };

  return mapRelationOf(
    type,
    relations,
    schema,
    (type, relationName, relationType, results) => {
      if (
        typeof relationType === "object" &&
        relationType !== null &&
        isNamedType(type) &&
        "type" in relationType &&
        getNamedType(relationType.type as Maybe<GraphQLType>)?.name ===
          type.name
      ) {
        if (
          !results.find(
            (r) =>
              typeof r === "object" &&
              r !== null &&
              "name" in r &&
              r.name === relationName,
          )
        ) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
};

export const getRelationOfField: IGetRelation<
  Record<string, (GraphQLDirective | GraphQLNamedType)[]>
> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<string, (GraphQLDirective | GraphQLNamedType)[]> => {
  const relations: Partial<
    Record<SchemaEntity, (GraphQLDirective | GraphQLNamedType)[]>
  > = {
    queries: [],
    mutations: [],
    subscriptions: [],
    objects: [],
    interfaces: [],
    inputs: [],
    directives: [],
  };

  return mapRelationOf<GraphQLDirective | GraphQLNamedType>(
    type,
    relations,
    schema,
    (type, relationName, relationType, results) => {
      // directives are handled as flat array instead of map
      const key = isDirectiveType(relationType)
        ? relationType.name
        : relationName;

      const paramFieldArgs = isGraphQLFieldType(relationType)
        ? relationType.args
        : {};
      const fieldMap = __getFields(relationType, undefined, {});

      const fields = Object.assign({}, paramFieldArgs, fieldMap);
      for (const fieldDef of Object.values(fields)) {
        if (
          isNamedType(type) &&
          getNamedType(fieldDef.type as Maybe<GraphQLType>)?.name === type.name
        ) {
          if (
            !results.find(
              (r) =>
                r.toString() === key ||
                (typeof r === "object" && "name" in r && r.name === key),
            )
          ) {
            results.push(relationType as GraphQLDirective | GraphQLNamedType);
          }
        }
      }
      return results;
    },
  );
};

export const getRelationOfUnion: IGetRelation<
  Record<string, GraphQLUnionType[]>
> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<string, GraphQLUnionType[]> => {
  const relations: Partial<Record<SchemaEntity, GraphQLUnionType[]>> = {
    unions: [],
  };

  return mapRelationOf<GraphQLUnionType>(
    type,
    relations,
    schema,
    (type, relationName, relationType, results) => {
      if (
        isNamedType(type) &&
        isUnionType(relationType) &&
        relationType.getTypes().find((subType) => subType.name === type.name)
      ) {
        if (
          !results.find(
            (r) =>
              typeof r === "object" && "name" in r && r.name === relationName,
          )
        ) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
};

export const getRelationOfInterface: IGetRelation<
  Record<string, (GraphQLInterfaceType | GraphQLObjectType)[]>
> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<string, (GraphQLInterfaceType | GraphQLObjectType)[]> => {
  const relations: Partial<
    Record<SchemaEntity, (GraphQLInterfaceType | GraphQLObjectType)[]>
  > = {
    objects: [],
    interfaces: [],
  };

  return mapRelationOf<GraphQLInterfaceType | GraphQLObjectType>(
    type,
    relations,
    schema,
    (type, relationName, relationType, results) => {
      if (
        isNamedType(type) &&
        (isObjectType(relationType) || isInterfaceType(relationType)) &&
        relationType
          .getInterfaces()
          .find((subType) => subType.name === type.name)
      ) {
        if (
          !results.find(
            (r) =>
              typeof r === "object" && "name" in r && r.name === relationName,
          )
        ) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
};

export const getRelationOfImplementation: IGetRelation<
  Record<
    string,
    (GraphQLInterfaceType | GraphQLObjectType | GraphQLUnionType)[]
  >
> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<
  string,
  (GraphQLInterfaceType | GraphQLObjectType | GraphQLUnionType)[]
> => {
  return {
    ...getRelationOfInterface(type, schema),
    ...getRelationOfUnion(type, schema),
  };
};
