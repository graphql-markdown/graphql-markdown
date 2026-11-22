import { Printer, toLink } from "../../src";
import { toLink as linkToLink } from "../../src/link";

describe("index", () => {
  test("exports Printer exposing init() and printType()", async () => {
    expect(Printer).toBeDefined();
    expect(Printer).toHaveProperty("init");
    expect(Printer).toHaveProperty("printType");
  });

  test("exports toLink for custom formatters", () => {
    expect(toLink).toBe(linkToLink);
  });
});
