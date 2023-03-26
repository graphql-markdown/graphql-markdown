describe("index", () => {
  test("exports Printer object by default", () => {
    const Printer = require("../../src");
    expect(Printer).toHaveProperty("init");
    expect(Printer).toHaveProperty("printType");
  });
});
