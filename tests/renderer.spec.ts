import { renderNode } from "../src/lib/renderer";

import kindMutation from "./__data__/node/mutation";
import kindSubscription from "./__data__/node/subscription";
import kindObject from "./__data__/node/object";
import kindInput from "./__data__/node/input";
import kindScalar from "./__data__/node/scalar";
import kindQuery from "./__data__/node/query";
import { directiveDeprecated, directiveSpecifiedBy } from "./__data__/node/directive";

describe("renderNode", () => {
  describe("Query", () => {
    it("should render Query", async () => {
      expect.hasAssertions();

      const result = await renderNode(kindQuery);
      expect(result).toMatchSnapshot();
});
  });

  describe("Mutation", () => {
    it("should render Mutation", async () => {
      expect.hasAssertions();

      const result = await renderNode(kindMutation);
      expect(result).toMatchSnapshot();
    });
  });

  describe("Subscription", () => {
    it("should render Subscription", async () => {
      expect.hasAssertions();

      const result = await renderNode(kindSubscription);
      expect(result).toMatchSnapshot();
    });
  });

  describe("Enum", () => {
    it("should render Enum", () => {});
  });

  describe("Object", () => {
    it("should render Object", async () => {
      expect.hasAssertions();

      const result = await renderNode(kindObject);
      expect(result).toMatchSnapshot();
    });
  });

  describe("Input", () => {
    it("should render Input", async () => {
      expect.hasAssertions();

      const result = await renderNode(kindInput);
      expect(result).toMatchSnapshot();
    });
  });

  describe("Scalar", () => {
    it("should render Scalar without description", async () => {
      expect.hasAssertions();

      const result = await renderNode({
        ...kindScalar,
        description: undefined
      });
      expect(result).toMatchSnapshot();
    });

    it("should render Scalar with description supporting Markdown notation", async () => {
      expect.hasAssertions();

      const result = await renderNode(kindScalar);
      expect(result).toMatchSnapshot();
    });

    it("should render Scalar with specifiedBy", async () => {
      expect.hasAssertions();

      const result = await renderNode({...kindScalar, directives: [directiveSpecifiedBy]});
      expect(result).toMatchSnapshot();
    });
  });

  describe("Interface", () => {
    it("should render Interface", () => {});
  });

  describe("Union", () => {
    it("should render Union", () => {});
  });
});
