const cli = require("./lib/cli");

describe("graphql-to-doc", () => {
  test("should return 0 with success message when completed", async () => {
    expect.assertions(1);
    return expect(cli()).resolves.toMatchSnapshot();
  }, 60000);
});
