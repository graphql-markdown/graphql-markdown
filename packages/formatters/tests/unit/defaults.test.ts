import { formatMDXAdmonition } from "../../src/defaults";

describe("formatMDXAdmonition", () => {
  test("renders the text as a Markdown paragraph between blank lines", () => {
    const result = formatMDXAdmonition(
      {
        type: "warning",
        title: "DEPRECATED",
        text: "Replaced by the [`ProjectStatus`](/x) enum.",
      },
      undefined,
    );

    expect(result).toContain(
      "</legend>\n\nReplaced by the [`ProjectStatus`](/x) enum.\n\n</fieldset>",
    );
    expect(result).not.toContain("<span>Replaced");
  });
});
