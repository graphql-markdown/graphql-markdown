import { printCodeBlock } from "../../src/const/strings";

describe("printCodeBlock()", () => {
  test("matches the legacy output without backtick runs", () => {
    expect.hasAssertions();

    expect(printCodeBlock("type A")).toBe("\n```graphql\ntype A\n```\n");
    expect(printCodeBlock("a `b` `` c")).toBe(
      "\n```graphql\na `b` `` c\n```\n",
    );
  });

  test("uses a 4-backtick fence when code contains ```", () => {
    expect.hasAssertions();

    expect(printCodeBlock("a\n```\nb")).toBe(
      "\n````graphql\na\n```\nb\n````\n",
    );
  });

  test("uses a 6-backtick fence when code contains `````", () => {
    expect.hasAssertions();

    expect(printCodeBlock("a`````b")).toBe(
      "\n``````graphql\na`````b\n``````\n",
    );
  });

  test("supports a custom language", () => {
    expect.hasAssertions();

    expect(printCodeBlock("x", "json")).toBe("\n```json\nx\n```\n");
  });
});
