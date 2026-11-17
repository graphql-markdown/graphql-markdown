import {
  capitalize,
  escapeMDX,
  prune,
  replaceDiacritics,
  stringCaseBuilder,
  slugify,
  startCase,
  kebabCase,
  firstUppercase,
} from "../../src/string";

describe("string", () => {
  describe("stringCaseBuilder()", () => {
    test("applies no transformation if one is not given", () => {
      expect.hasAssertions();

      const text = "this is Not Transformed to lowercase 42 times.";
      const expected = "this is Not Transformed to lowercase 42 times.";

      expect(stringCaseBuilder(text, undefined)).toBe(expected);
    });

    test("returns empty string if param not a string", () => {
      expect(stringCaseBuilder(undefined, undefined)).toBe("");
    });

    test("returns a string with a transformation applied for each word using custom char for splitting", () => {
      const text = "The quick brown fox/jumps over the lazy dog.";
      const expected =
        "*The* *quick* *brown* *fox/jumps* *over* *the* *lazy* *dog.*";
      const transformation = (word: string): string => {
        return `*${word}*`;
      };

      expect(stringCaseBuilder(text, transformation, " ", " ")).toBe(expected);
    });

    test("returns a string with a transformation applied for each word using custom default splitting", () => {
      const text = "The quick brown fox/jumps over the lazy dog.";
      const expected =
        "*The* *quick* *brown* *fox* *jumps* *over* *the* *lazy* *dog*";
      const transformation = (word: string): string => {
        return `*${word}*`;
      };

      const value = stringCaseBuilder(text, transformation, " ");

      expect(value).toBe(expected);
    });

    test("splits words on case and letter/digit boundaries", () => {
      const value = stringCaseBuilder(
        "fooBar2baz9Qux",
        (word) => {
          return word;
        },
        "-",
      );

      expect(value).toBe("foo-Bar-2-baz-9-Qux");
    });

    test("handles long uniform runs in linear time (ReDoS regression)", () => {
      const text = `${"a".repeat(100_000)}!${"0".repeat(100_000)}!`;
      const start = performance.now();

      stringCaseBuilder(
        text,
        (word) => {
          return word;
        },
        " ",
      );

      expect(performance.now() - start).toBeLessThan(1000);
    });
  });

  describe("replaceDiacritics()", () => {
    test("returns string without diacritic characters", () => {
      expect.hasAssertions();

      const text = "Âéêś";
      const expected = "Aees";

      expect(replaceDiacritics(text)).toBe(expected);
    });

    test("returns empty string if param not a string", () => {
      expect.hasAssertions();

      expect(replaceDiacritics(undefined)).toBe("");
    });
  });

  describe("prune()", () => {
    test.each([
      {
        text: "-string-that-begins-and-ends-with-dash-",
        expected: "string-that-begins-and-ends-with-dash",
      },
      {
        text: "-string-that-begins-with-dash",
        expected: "string-that-begins-with-dash",
      },
      {
        text: "string-that-ends-with-dash-",
        expected: "string-that-ends-with-dash",
      },
      {
        text: "string-with-no-dashes-in-beginning-or-end",
        expected: "string-with-no-dashes-in-beginning-or-end",
      },
    ])("removes dash from beginning and/or end", ({ text, expected }) => {
      expect.hasAssertions();

      expect(prune(text, "-")).toBe(expected);
    });

    test("returns empty string if param not a string", () => {
      expect.hasAssertions();

      expect(prune(undefined)).toBe("");
    });

    test("returns unchanged string if substr is an empty string", () => {
      expect.hasAssertions();

      expect(prune("A string.")).toBe("A string.");
    });

    test("removes multiple characters", () => {
      expect.hasAssertions();

      expect(
        prune("**The quick brown fox jumps over the lazy dog.**", "**"),
      ).toBe("The quick brown fox jumps over the lazy dog.");
    });
  });

  describe("slugify()", () => {
    test("returns kebab style slug", () => {
      expect.hasAssertions();

      const text = "This is not a slug, but you can use to slug function.";
      const expected = "this-is-not-a-slug-but-you-can-use-to-slug-function";

      expect(slugify(text)).toBe(expected);
    });

    test("returns empty string if param not a string", () => {
      expect.hasAssertions();

      expect(slugify(undefined)).toBe("");
    });
  });

  describe("escapeMDX()", () => {
    test("returns string with HTML &#x0000; format for MDX special characters", () => {
      expect.hasAssertions();

      expect(
        escapeMDX("{MDX} <special> characters and formatting _test_"),
      ).toBe(
        "&#x007B;MDX&#x007D; &#x003C;special&#x003E; characters and formatting &#x005F;test&#x005F;",
      );
    });

    test("does not transform MDX special characters enclosed as code", () => {
      expect.hasAssertions();

      expect(escapeMDX(">`{MDX}` `<special>` characters `_test_`")).toBe(
        "&#x003E;`{MDX}` `<special>` characters `_test_`",
      );
    });

    test.each([
      [
        "trailing unmatched backtick",
        "<img src=x onerror=alert(1)> {globalThis.pwned = 1} trailing `",
        "&#x003C;img src=x onerror=alert(1)&#x003E; &#x007B;globalThis.pwned = 1&#x007D; trailing `",
      ],
      [
        "leading unmatched backtick",
        "` <b>{x}</b>",
        "` &#x003C;b&#x003E;&#x007B;x&#x007D;&#x003C;/b&#x003E;",
      ],
      [
        "double-backtick opener closed by a single backtick",
        "``<b>` text",
        "``&#x003C;b&#x003E;` text",
      ],
      [
        "backslash-escaped opener",
        "\\``x` <b> `",
        "\\``x` &#x003C;b&#x003E; `",
      ],
      [
        "inline span split across lines",
        "`a\n# <b>`",
        "`a\n# &#x003C;b&#x003E;`",
      ],
      [
        "fence opened mid-line",
        "x ```\n\n<b>\n\n```",
        "x ```\n\n&#x003C;b&#x003E;\n\n```",
      ],
      ["unclosed fence", "text\n```\n<b>", "text\n```\n&#x003C;b&#x003E;"],
      [
        "inline span split by a GFM table cell",
        "| a | b |\n| - | - |\n| `x | <b> ` |",
        "| a | b |\n| - | - |\n| `x | &#x003C;b&#x003E; ` |",
      ],
      [
        "inline span split by a CR line ending",
        "`a\r# <b>`",
        "`a\n# &#x003C;b&#x003E;`",
      ],
      [
        "inline span split by a CRLF line ending",
        "`a\r\n# <b>`",
        "`a\n# &#x003C;b&#x003E;`",
      ],
      [
        "indented fence shifting the pairing of later fences",
        "x\n  ```\n```\n<b>\n```",
        "x\n  ```\n```\n&#x003C;b&#x003E;\n```",
      ],
      [
        "fence at the string start shifting the pairing of later fences",
        "```\n```\n<b>\n```",
        "```\n```\n&#x003C;b&#x003E;\n```",
      ],
      [
        "tilde fence shifting the pairing of later fences",
        "x\n~~~\n```\n~~~\n<b>\n```",
        "x\n~~~\n```\n~~~\n&#x003C;b&#x003E;\n```",
      ],
      [
        "unpaired run that Markdown pairs with a later line",
        "a ```\n    ```{x}```{x}",
        "a ```\n    ```&#x007B;x&#x007D;```&#x007B;x&#x007D;",
      ],
      [
        "span across lines hiding an HTML comment from MDX",
        " `\n| - |`# <!--`",
        " `\n| - |`# &#x003C;!--`",
      ],
      [
        "indented closer that ends the fence for MDX only",
        "x\n```\n    ```\n<b>\n```",
        "x\n```\n    ```\n&#x003C;b&#x003E;\n```",
      ],
      [
        "tab-indented closer that ends the fence for MDX only",
        "x\n```\n\t```\n<b>\n```",
        "x\n```\n\t```\n&#x003C;b&#x003E;\n```",
      ],
      [
        "indented tilde fence that MDX opens around a later fence",
        "    ~~~\n```\n    ~~~\n<b>\n```",
        "    ~~~\n```\n    ~~~\n&#x003C;b&#x003E;\n```",
      ],
      [
        "backticks hidden in a link destination",
        "x[](``js)`--><!--``",
        "x[](``js)`--&#x003E;&#x003C;!--``",
      ],
      [
        "backticks in a link title continuing onto the next line",
        '[x](/u "a\nx `" <b> `',
        '[x](/u "a\nx `" &#x003C;b&#x003E; `',
      ],
      [
        "inline span containing a pipe outside a table",
        "`a|b` <b> `",
        "`a|b` &#x003C;b&#x003E; `",
      ],
      [
        "indented fence that a list item can close early",
        "- x\n  ```\n<b>\n```",
        "- x\n  ```\n&#x003C;b&#x003E;\n```",
      ],
    ])(
      "escapes MDX special characters outside real code (%s)",
      (_, value, expected) => {
        expect.hasAssertions();

        expect(escapeMDX(value)).toBe(expected);
      },
    );

    test.each([
      [
        "double-backtick span",
        "``a ` <b>`` {x}",
        "``a ` <b>`` &#x007B;x&#x007D;",
      ],
      [
        "inline code at a line start that looks like a fence",
        "text\n```a<b``` {x}",
        "text\n```a<b``` &#x007B;x&#x007D;",
      ],
      [
        "fenced code block",
        "Example:\n```graphql\ntype A { b: <C> }\n```\n{x}",
        "Example:\n```graphql\ntype A { b: <C> }\n```\n&#x007B;x&#x007D;",
      ],
    ])(
      "preserves MDX special characters in code (%s)",
      (_, value, expected) => {
        expect.hasAssertions();

        expect(escapeMDX(value)).toBe(expected);
      },
    );

    test.each([
      [5, "5"],
      [{ five: 5 }, "[object Object]"],
    ])("returns a stringified version if not a string", (value, expected) => {
      expect.hasAssertions();

      expect(escapeMDX(value)).toBe(expected);
    });
  });

  describe("capitalize()", () => {
    test.each([
      ["A", "A"],
      ["foobar", "Foobar"],
      [
        "the quick brown fox jumps over the lazy dog",
        "The quick brown fox jumps over the lazy dog",
      ],
      ["42 dollars", "42 dollars"],
      ["fooBar", "Foobar"],
    ])(
      "returns capitalized string: first letter uppercase, rest lowercase - %#",
      (input, expected) => {
        expect.hasAssertions();

        expect(capitalize(input)).toBe(expected);
      },
    );

    test("returns empty string if param not a string", () => {
      expect.hasAssertions();

      expect(capitalize(undefined)).toBe("");
    });
  });

  describe("startCase()", () => {
    test("returns startCase version", () => {
      expect.hasAssertions();

      expect(startCase("the quick Brown Fox")).toBe("The Quick Brown Fox");
    });
  });

  describe("kebabCase()", () => {
    test("returns a kebabCase version", () => {
      expect.hasAssertions();

      expect(kebabCase("the quick Brown Fox")).toBe("the-quick-brown-fox");
    });
  });

  describe("firstUppercase()", () => {
    test("returns empty string if not a string", () => {
      expect.hasAssertions();

      expect(firstUppercase(null)).toBe("");
    });

    test("returns a firstUppercase version", () => {
      expect.hasAssertions();

      expect(firstUppercase("the quick Brown Fox")).toBe("The quick Brown Fox");
    });
  });
});
