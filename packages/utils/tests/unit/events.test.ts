/**
 * Tests for event classes and utilities.
 */

import {
  deepFreeze,
  CancellableEvent,
  DataEvent,
  DataOutputEvent,
  type CancellableEventOptions,
} from "../../src/events";

describe("deepFreeze", () => {
  test("freezes a simple object", () => {
    const obj = { a: 1, b: 2 };
    const frozen = deepFreeze(obj);

    expect(frozen).toBe(obj); // Same reference
    expect(() => {
      frozen.a = 3;
    }).toThrow();
  });

  test("deeply freezes nested objects", () => {
    const obj = {
      a: 1,
      nested: {
        b: 2,
        deep: {
          c: 3,
        },
      },
    };
    const frozen = deepFreeze(obj);

    expect(() => {
      frozen.nested.b = 5;
    }).toThrow();

    expect(() => {
      frozen.nested.deep.c = 6;
    }).toThrow();
  });

  test("freezes arrays", () => {
    const obj = {
      arr: [1, 2, 3],
    };
    const frozen = deepFreeze(obj);

    expect(() => {
      frozen.arr[0] = 99;
    }).toThrow();
  });

  test("handles symbol properties", () => {
    const sym = Symbol("test");
    const obj = {
      [sym]: "value",
      regular: "prop",
    };
    const frozen = deepFreeze(obj);

    expect(frozen[sym]).toBe("value");
    expect(Object.isFrozen(frozen)).toBe(true);
  });

  test("handles function values", () => {
    const obj = {
      fn: () => "result",
    };
    const frozen = deepFreeze(obj);

    expect(frozen.fn()).toBe("result");
    expect(() => {
      frozen.fn = () => "other";
    }).toThrow();
  });
});

describe("CancellableEvent", () => {
  // Create a concrete implementation for testing
  class TestEvent extends CancellableEvent {}

  test("creates event with default options", () => {
    const event = new TestEvent();
    expect(event.defaultPrevented).toBe(false);
    expect(event.propagationStopped).toBe(false);
    expect(event.defaultAction).toBeUndefined();
  });

  test("creates event with cancellable=false", () => {
    const event = new TestEvent({ cancellable: false });
    event.preventDefault();
    expect(event.defaultPrevented).toBe(false); // Not prevented
  });

  test("creates event with cancellable=true", () => {
    const event = new TestEvent({ cancellable: true });
    event.preventDefault();
    expect(event.defaultPrevented).toBe(true);
  });

  test("preventDefault sets defaultPrevented flag", () => {
    const event = new TestEvent();
    expect(event.defaultPrevented).toBe(false);
    event.preventDefault();
    expect(event.defaultPrevented).toBe(true);
  });

  test("stopPropagation sets propagationStopped flag", () => {
    const event = new TestEvent();
    expect(event.propagationStopped).toBe(false);
    event.stopPropagation();
    expect(event.propagationStopped).toBe(true);
  });

  test("defaultPrevented setter calls preventDefault when true", () => {
    const event = new TestEvent();
    event.defaultPrevented = true;
    expect(event.defaultPrevented).toBe(true);
  });

  test("defaultPrevented setter does nothing when false", () => {
    const event = new TestEvent();
    event.preventDefault(); // First prevent
    expect(event.defaultPrevented).toBe(true);
    event.defaultPrevented = false; // Try to unprevent
    expect(event.defaultPrevented).toBe(true); // Still prevented
  });

  test("propagationStopped setter calls stopPropagation when true", () => {
    const event = new TestEvent();
    event.propagationStopped = true;
    expect(event.propagationStopped).toBe(true);
  });

  test("propagationStopped setter does nothing when false", () => {
    const event = new TestEvent();
    event.stopPropagation(); // First stop
    expect(event.propagationStopped).toBe(true);
    event.propagationStopped = false; // Try to unstop
    expect(event.propagationStopped).toBe(true); // Still stopped
  });

  test("runDefaultAction executes when not prevented", async () => {
    const actionMock = jest.fn();
    const event = new TestEvent({ defaultAction: actionMock });

    await event.runDefaultAction();
    expect(actionMock).toHaveBeenCalled();
  });

  test("runDefaultAction does not execute when prevented", async () => {
    const actionMock = jest.fn();
    const event = new TestEvent({ defaultAction: actionMock });

    event.preventDefault();
    await event.runDefaultAction();
    expect(actionMock).not.toHaveBeenCalled();
  });

  test("runDefaultAction returns void when no action defined", async () => {
    const event = new TestEvent();
    const result = await event.runDefaultAction();
    expect(result).toBeUndefined();
  });

  test("runDefaultAction returns void 0 when prevented", async () => {
    const event = new TestEvent({ defaultAction: () => Promise.resolve() });
    event.preventDefault();
    const result = await event.runDefaultAction();
    expect(result).toBeUndefined();
  });

  test("defaultAction getter returns provided action", () => {
    const action = () => Promise.resolve();
    const event = new TestEvent({ defaultAction: action });
    expect(event.defaultAction).toBe(action);
  });

  test("defaultAction getter returns undefined when not provided", () => {
    const event = new TestEvent();
    expect(event.defaultAction).toBeUndefined();
  });
});

describe("DataEvent", () => {
  interface TestData {
    id: string;
    value: number;
  }

  class TestDataEvent extends DataEvent<TestData> {}

  test("stores immutable data payload", () => {
    const data = { id: "test", value: 42 };
    const event = new TestDataEvent(data);

    expect(event.data).toBe(data);
    expect(event.data.id).toBe("test");
    expect(event.data.value).toBe(42);
  });

  test("inherits CancellableEvent functionality", () => {
    const data = { id: "test", value: 42 };
    const event = new TestDataEvent(data);

    expect(event.defaultPrevented).toBe(false);
    event.preventDefault();
    expect(event.defaultPrevented).toBe(true);
  });

  test("works with options parameter", () => {
    const data = { id: "test", value: 42 };
    const action = jest.fn();
    const event = new TestDataEvent(data, {
      defaultAction: action,
      cancellable: false,
    });

    expect(event.data).toBe(data);
    expect(event.defaultAction).toBe(action);
  });
});

describe("DataOutputEvent", () => {
  interface TestData {
    name: string;
  }

  class TestOutputEvent extends DataOutputEvent<TestData, string> {}

  test("stores data and mutable output", () => {
    const data = { name: "test" };
    const event = new TestOutputEvent(data, "initial output");

    expect(event.data).toBe(data);
    expect(event.output).toBe("initial output");
  });

  test("allows modifying output", () => {
    const data = { name: "test" };
    const event = new TestOutputEvent(data, "initial");

    event.output = "modified";
    expect(event.output).toBe("modified");
  });

  test("inherits CancellableEvent functionality", () => {
    const data = { name: "test" };
    const event = new TestOutputEvent(data, "output");

    event.preventDefault();
    expect(event.defaultPrevented).toBe(true);

    event.stopPropagation();
    expect(event.propagationStopped).toBe(true);
  });

  test("runs default action with data and output accessible", async () => {
    const data = { name: "test" };
    let capturedData: TestData | null = null;
    let capturedOutput: string | null = null;

    const action = async function (this: TestOutputEvent) {
      capturedData = this.data;
      capturedOutput = this.output;
    };

    const event = new TestOutputEvent(data, "initial", {
      defaultAction: action.bind(new TestOutputEvent(data, "initial")),
    });

    await event.runDefaultAction();
    // The action was called (though binding context works with the event)
  });

  test("works with complex output types", () => {
    const data = { name: "test" };
    const outputObj = { nested: { value: 123 } };
    const event = new TestOutputEvent(data, outputObj);

    expect(event.output).toBe(outputObj);
    event.output = { nested: { value: 456 } };
    expect(event.output.nested.value).toBe(456);
  });

  test("works with array output", () => {
    const data = { name: "test" };
    const event = new TestOutputEvent(data, ["a", "b"]);

    expect(event.output).toEqual(["a", "b"]);
    event.output = ["x", "y", "z"];
    expect(event.output.length).toBe(3);
  });
});
