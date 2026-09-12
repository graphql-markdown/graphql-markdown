import { buildSchema } from "graphql/utilities";
import type { PrintTypeOptions } from "@graphql-markdown/types";

import {
  always,
  and,
  directiveOccurrences,
  hasAnyDirective,
  hasDirectiveNamed,
  isEntity,
  not,
  or,
} from "../../src/predicate";

const schema = buildSchema(`
  directive @httpResponse(
    code: Int!
    description: String
  ) repeatable on OBJECT | FIELD_DEFINITION

  directive @noArgDirective on OBJECT

  enum Status {
    ACTIVE
    INACTIVE
  }

  scalar Date

  input Filter {
    name: String
  }

  interface Node {
    id: ID!
  }

  union SearchResult = WithDirective | WithoutDirective

  type WithDirective implements Node
    @httpResponse(code: 200, description: "OK")
    @httpResponse(code: 404, description: "Not found") {
    id: ID!
  }

  type WithoutDirective {
    id: ID!
  }

  type WithOtherDirective @noArgDirective {
    id: ID!
  }
`);

const withDirective = schema.getType("WithDirective")!;
const withoutDirective = schema.getType("WithoutDirective")!;
const withOtherDirective = schema.getType("WithOtherDirective")!;
const status = schema.getType("Status")!;
const date = schema.getType("Date")!;
const filter = schema.getType("Filter")!;
const node = schema.getType("Node")!;
const searchResult = schema.getType("SearchResult")!;
const httpResponseDirective = schema.getDirective("httpResponse")!;

const baseOptions = { basePath: "/", schema } as PrintTypeOptions;

describe("hasDirectiveNamed", () => {
  test("returns true when the node carries the named directive", () => {
    expect.assertions(1);

    expect(hasDirectiveNamed("httpResponse")(withDirective, baseOptions)).toBe(
      true,
    );
  });

  test("returns false when the node does not carry the named directive", () => {
    expect.assertions(1);

    expect(
      hasDirectiveNamed("httpResponse")(withoutDirective, baseOptions),
    ).toBe(false);
  });

  test("returns false when the node carries a different directive", () => {
    expect.assertions(1);

    expect(
      hasDirectiveNamed("httpResponse")(withOtherDirective, baseOptions),
    ).toBe(false);
  });

  test("returns false for null/undefined/non-object input", () => {
    expect.assertions(3);

    expect(hasDirectiveNamed("httpResponse")(null, baseOptions)).toBe(false);
    expect(hasDirectiveNamed("httpResponse")(undefined, baseOptions)).toBe(
      false,
    );
    expect(hasDirectiveNamed("httpResponse")("a string", baseOptions)).toBe(
      false,
    );
  });
});

describe("hasAnyDirective", () => {
  test("returns true when the node carries at least one directive", () => {
    expect.assertions(2);

    expect(hasAnyDirective()(withDirective, baseOptions)).toBe(true);
    expect(hasAnyDirective()(withOtherDirective, baseOptions)).toBe(true);
  });

  test("returns false when the node carries no directive", () => {
    expect.assertions(1);

    expect(hasAnyDirective()(withoutDirective, baseOptions)).toBe(false);
  });

  test("returns false for null/undefined input", () => {
    expect.assertions(2);

    expect(hasAnyDirective()(null, baseOptions)).toBe(false);
    expect(hasAnyDirective()(undefined, baseOptions)).toBe(false);
  });
});

describe("isEntity", () => {
  test("matches an object type", () => {
    expect.assertions(1);

    expect(isEntity("objects")(withDirective, baseOptions)).toBe(true);
  });

  test("matches an enum type", () => {
    expect.assertions(1);

    expect(isEntity("enums")(status, baseOptions)).toBe(true);
  });

  test("matches a scalar type", () => {
    expect.assertions(1);

    expect(isEntity("scalars")(date, baseOptions)).toBe(true);
  });

  test("matches an input type", () => {
    expect.assertions(1);

    expect(isEntity("inputs")(filter, baseOptions)).toBe(true);
  });

  test("matches an interface type", () => {
    expect.assertions(1);

    expect(isEntity("interfaces")(node, baseOptions)).toBe(true);
  });

  test("matches a union type", () => {
    expect.assertions(1);

    expect(isEntity("unions")(searchResult, baseOptions)).toBe(true);
  });

  test("matches a directive type", () => {
    expect.assertions(1);

    expect(isEntity("directives")(httpResponseDirective, baseOptions)).toBe(
      true,
    );
  });

  test("does not match a kind not in the list", () => {
    expect.assertions(1);

    expect(isEntity("enums", "scalars")(withDirective, baseOptions)).toBe(
      false,
    );
  });

  test("returns false when the entity kind cannot be resolved", () => {
    expect.assertions(1);

    expect(isEntity("objects")({ name: "NotAType" }, baseOptions)).toBe(false);
  });

  test("prefers options.entity when set", () => {
    expect.assertions(1);

    expect(
      isEntity("mutations")(withDirective, {
        ...baseOptions,
        entity: "mutations",
      }),
    ).toBe(true);
  });
});

describe("and", () => {
  test("is true only when every predicate is true", () => {
    expect.assertions(2);

    expect(
      and(hasDirectiveNamed("httpResponse"), isEntity("objects"))(
        withDirective,
        baseOptions,
      ),
    ).toBe(true);
    expect(
      and(hasDirectiveNamed("httpResponse"), isEntity("enums"))(
        withDirective,
        baseOptions,
      ),
    ).toBe(false);
  });

  test("is true with zero predicates (vacuous truth)", () => {
    expect.assertions(1);

    expect(and()(withDirective, baseOptions)).toBe(true);
  });
});

describe("or", () => {
  test("is true when at least one predicate is true", () => {
    expect.assertions(2);

    expect(
      or(hasDirectiveNamed("httpResponse"), isEntity("enums"))(
        withDirective,
        baseOptions,
      ),
    ).toBe(true);
    expect(
      or(hasDirectiveNamed("nope"), isEntity("enums"))(
        withDirective,
        baseOptions,
      ),
    ).toBe(false);
  });

  test("is false with zero predicates (vacuous falsehood)", () => {
    expect.assertions(1);

    expect(or()(withDirective, baseOptions)).toBe(false);
  });
});

describe("not", () => {
  test("negates the given predicate", () => {
    expect.assertions(2);

    expect(
      not(hasDirectiveNamed("httpResponse"))(withDirective, baseOptions),
    ).toBe(false);
    expect(
      not(hasDirectiveNamed("httpResponse"))(withoutDirective, baseOptions),
    ).toBe(true);
  });
});

describe("always", () => {
  test("is always true regardless of the node", () => {
    expect.assertions(3);

    expect(always()(withDirective, baseOptions)).toBe(true);
    expect(always()(null, baseOptions)).toBe(true);
    expect(always()(undefined, baseOptions)).toBe(true);
  });
});

describe("directiveOccurrences", () => {
  test("returns one record per occurrence, in declaration order", () => {
    expect.assertions(1);

    expect(
      directiveOccurrences("httpResponse")(withDirective, baseOptions),
    ).toStrictEqual([
      { code: 200, description: "OK" },
      { code: 404, description: "Not found" },
    ]);
  });

  test("returns an empty array when the node has no occurrence", () => {
    expect.assertions(1);

    expect(
      directiveOccurrences("httpResponse")(withoutDirective, baseOptions),
    ).toStrictEqual([]);
  });

  test("returns an empty array when the directive is absent from the schema", () => {
    expect.assertions(1);

    expect(
      directiveOccurrences("doesNotExist")(withDirective, baseOptions),
    ).toStrictEqual([]);
  });

  test("returns an empty array when options.schema is missing", () => {
    expect.assertions(1);

    expect(
      directiveOccurrences("httpResponse")(withDirective, {
        basePath: "/",
      } as PrintTypeOptions),
    ).toStrictEqual([]);
  });
});
