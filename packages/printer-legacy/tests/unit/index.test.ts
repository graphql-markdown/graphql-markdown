import { Printer } from "../../src";

describe("index", () => {
  test("exports Printer exposing init() and printType()", async () => {
    expect(Printer).toBeDefined();
    expect(Printer).toHaveProperty("init");
    expect(Printer).toHaveProperty("printType");
  });
});
