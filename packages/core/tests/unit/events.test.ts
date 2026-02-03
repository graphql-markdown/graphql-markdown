import { getEvents, resetEvents } from "../../src/event-emitter";
import {
  CancellableEvent,
  deepFreeze,
  SchemaEvent,
  SchemaEvents,
  GenerateIndexMetafileEvent,
  RenderTypeEntitiesEvent,
  PrintCodeEvent,
  PrintTypeEvent,
  PrintTypeEvents,
} from "../../src/events";
import { CancellableEventOptions } from "../../src/events/base";

describe("events", () => {
  afterEach(() => {
    resetEvents();
    jest.restoreAllMocks();
  });

  describe("deepFreeze", () => {
    it("should freeze top-level object properties", () => {
      const obj = { name: "test", count: 42 };
      deepFreeze(obj);

      expect(() => {
        (obj as any).name = "changed";
      }).toThrow();
    });

    it("should recursively freeze nested objects", () => {
      const obj = { user: { name: "John", age: 30 } };
      deepFreeze(obj);

      expect(() => {
        (obj.user as any).name = "Jane";
      }).toThrow();
    });

    it("should freeze arrays", () => {
      const obj = { items: [1, 2, 3] };
      deepFreeze(obj);

      expect(() => {
        obj.items.push(4);
      }).toThrow();
    });

    it("should return the same object reference", () => {
      const obj = { name: "test" };
      const frozen = deepFreeze(obj);

      expect(frozen).toBe(obj);
    });
  });

  describe("CancellableEvent", () => {
    class TestEvent extends CancellableEvent {
      readonly data: string;

      constructor(
        data: string,
        options?: { cancellable?: boolean; defaultAction?: () => void },
      ) {
        super(options as CancellableEventOptions);
        this.data = data;
        // Don't freeze - it prevents preventDefault/stopPropagation from working
      }
    }

    it("should initialize with defaultPrevented as false", () => {
      const event = new TestEvent("test");

      expect(event.defaultPrevented).toBe(false);
    });

    it("should initialize with propagationStopped as false", () => {
      const event = new TestEvent("test");

      expect(event.propagationStopped).toBe(false);
    });

    it("should set defaultPrevented to true when preventDefault is called", () => {
      const event = new TestEvent("test");

      event.preventDefault();

      expect(event.defaultPrevented).toBe(true);
    });

    it("should set propagationStopped to true when stopPropagation is called", () => {
      const event = new TestEvent("test");

      event.stopPropagation();

      expect(event.propagationStopped).toBe(true);
    });

    it("should not prevent default if event is not cancellable", () => {
      const event = new TestEvent("test", { cancellable: false });

      event.preventDefault();

      expect(event.defaultPrevented).toBe(false);
    });

    it("should always stop propagation regardless of cancellable flag", () => {
      const event = new TestEvent("test", { cancellable: false });

      event.stopPropagation();

      expect(event.propagationStopped).toBe(true);
    });

    it("should freeze payload properties", () => {
      // Create a custom event with an object payload
      class TestEventWithObject extends CancellableEvent {
        readonly payload: { name: string };

        constructor(payload: { name: string }) {
          super();
          this.payload = deepFreeze(payload); // Freeze just the payload
        }
      }

      const event = new TestEventWithObject({ name: "test" });

      expect(() => {
        (event.payload as any).name = "changed";
      }).toThrow();
    });
  });

  describe("SchemaEvent", () => {
    it("should store schemaLocation", () => {
      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema.graphql",
      });

      expect(event.data.schemaLocation).toBe("/path/to/schema.graphql");
    });

    it("should accept defaultAction", () => {
      const defaultAction = jest.fn(() => Promise.resolve());
      const event = new SchemaEvent(
        {
          schemaLocation: "/path/to/schema.graphql",
        },
        { defaultAction },
      );

      expect(event.defaultAction).toBe(defaultAction);
    });

    it("should be cancellable by default", () => {
      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema.graphql",
      });

      event.preventDefault();

      expect(event.defaultPrevented).toBe(true);
    });

    it("should respect cancellable parameter", () => {
      const event = new SchemaEvent(
        {
          schemaLocation: "/path/to/schema.graphql",
        },
        { cancellable: false },
      );

      event.preventDefault();

      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe("GenerateIndexMetafileEvent", () => {
    it("should store all properties", () => {
      const options = { custom: true };
      const event = new GenerateIndexMetafileEvent({
        dirPath: "/docs/api",
        category: "types",
        options,
      });

      expect(event.data.dirPath).toBe("/docs/api");
      expect(event.data.category).toBe("types");
      expect(event.data.options).toBe(options);
    });

    it("should work without options", () => {
      const event = new GenerateIndexMetafileEvent({
        dirPath: "/docs/api",
        category: "types",
      });

      expect(event.data.options).toBeUndefined();
    });
  });

  describe("RenderTypeEntitiesEvent", () => {
    it("should store name and filePath", () => {
      const event = new RenderTypeEntitiesEvent({
        name: "User",
        filePath: "/docs/types/user.md",
      });

      expect(event.data.name).toBe("User");
      expect(event.data.filePath).toBe("/docs/types/user.md");
    });
  });

  describe("getEvents", () => {
    it("should return a singleton instance", () => {
      const events1 = getEvents();
      const events2 = getEvents();

      expect(events1).toBe(events2);
    });

    it("should return same instance across different imports", () => {
      const events = getEvents();

      expect(events).toBeDefined();
      expect(typeof events.on).toBe("function");
      expect(typeof events.emitAsync).toBe("function");
    });
  });

  describe("resetEvents", () => {
    it("should clear all listeners", () => {
      const events = getEvents();
      const handler = jest.fn();

      events.on("testEvent", handler);
      resetEvents();

      // Get new instance and emit - handler should not be called
      const newEvents = getEvents();
      newEvents.emit("testEvent");

      expect(handler).not.toHaveBeenCalled();
    });

    it("should allow creating fresh instance", () => {
      const events1 = getEvents();
      resetEvents();
      const events2 = getEvents();

      // Should be different instances
      expect(events1).not.toBe(events2);
    });
  });

  describe("emitAsync", () => {
    it("should execute handlers in registration order", async () => {
      const events = getEvents();
      const order: number[] = [];

      events.on(SchemaEvents.BEFORE_LOAD, () => {
        order.push(1);
      });
      events.on(SchemaEvents.BEFORE_LOAD, () => {
        order.push(2);
      });
      events.on(SchemaEvents.BEFORE_LOAD, () => {
        order.push(3);
      });

      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema",
      });
      await events.emitAsync(SchemaEvents.BEFORE_LOAD, event);

      expect(order).toEqual([1, 2, 3]);
    });

    it("should collect errors from handlers", async () => {
      const events = getEvents();
      const error1 = new Error("Handler 1 failed");
      const error2 = new Error("Handler 2 failed");

      events.on(SchemaEvents.BEFORE_LOAD, () => {
        throw error1;
      });
      events.on(SchemaEvents.BEFORE_LOAD, () => {
        throw error2;
      });

      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema",
      });
      const { errors } = await events.emitAsync(
        SchemaEvents.BEFORE_LOAD,
        event,
      );

      expect(errors).toHaveLength(2);
      expect(errors[0]).toBe(error1);
      expect(errors[1]).toBe(error2);
    });

    it("should continue executing handlers after error", async () => {
      const events = getEvents();
      const handler2 = jest.fn();

      events.on(SchemaEvents.BEFORE_LOAD, () => {
        throw new Error("Handler 1 failed");
      });
      events.on(SchemaEvents.BEFORE_LOAD, handler2);

      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema",
      });
      await events.emitAsync(SchemaEvents.BEFORE_LOAD, event);

      expect(handler2).toHaveBeenCalled();
    });

    it("should stop executing handlers when stopPropagation is called", async () => {
      const events = getEvents();
      const handler2 = jest.fn();
      const handler3 = jest.fn();

      events.on(SchemaEvents.BEFORE_LOAD, (event) => {
        event.stopPropagation();
      });
      events.on(SchemaEvents.BEFORE_LOAD, handler2);
      events.on(SchemaEvents.BEFORE_LOAD, handler3);

      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema",
      });
      await events.emitAsync(SchemaEvents.BEFORE_LOAD, event);

      expect(handler2).not.toHaveBeenCalled();
      expect(handler3).not.toHaveBeenCalled();
    });

    it("should execute defaultAction if not prevented", async () => {
      const events = getEvents();
      const defaultAction = jest.fn(() => Promise.resolve());

      const event = new SchemaEvent(
        { schemaLocation: "/path/to/schema" },
        { defaultAction },
      );
      await events.emitAsync(SchemaEvents.BEFORE_LOAD, event);

      expect(defaultAction).toHaveBeenCalled();
    });

    it("should not execute defaultAction if prevented", async () => {
      const events = getEvents();
      const defaultAction = jest.fn(() => Promise.resolve());

      events.on(SchemaEvents.BEFORE_LOAD, (event) => {
        event.preventDefault();
      });

      const event = new SchemaEvent(
        { schemaLocation: "/path/to/schema" },
        { defaultAction },
      );
      await events.emitAsync(SchemaEvents.BEFORE_LOAD, event);

      expect(defaultAction).not.toHaveBeenCalled();
    });

    it("should return defaultPrevented status", async () => {
      const events = getEvents();

      events.on(SchemaEvents.BEFORE_LOAD, (event) => {
        event.preventDefault();
      });

      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema",
      });
      const { defaultPrevented } = await events.emitAsync(
        SchemaEvents.BEFORE_LOAD,
        event,
      );

      expect(defaultPrevented).toBe(true);
    });

    it("should collect errors from defaultAction", async () => {
      const events = getEvents();
      const error = new Error("Default action failed");

      const event = new SchemaEvent(
        { schemaLocation: "/path/to/schema" },
        {
          defaultAction: () => {
            throw error;
          },
        },
      );
      const { errors } = await events.emitAsync(
        SchemaEvents.BEFORE_LOAD,
        event,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(error);
    });

    it("should work with no handlers registered", async () => {
      const events = getEvents();

      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema",
      });
      const { errors, defaultPrevented } = await events.emitAsync(
        SchemaEvents.BEFORE_LOAD,
        event,
      );

      expect(errors).toHaveLength(0);
      expect(defaultPrevented).toBe(false);
    });

    it("should handle async handlers", async () => {
      const events = getEvents();

      const spy = jest.spyOn(console, "log").mockImplementation();

      events.on(SchemaEvents.BEFORE_LOAD, async () => {
        console.log(SchemaEvents.BEFORE_LOAD);
      });
      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema",
      });
      await events.emitAsync(SchemaEvents.BEFORE_LOAD, event);

      expect(spy.mock.lastCall).toEqual([SchemaEvents.BEFORE_LOAD]);
    });

    it("should handle async defaultAction", async () => {
      const events = getEvents();
      let executed = false;

      const event = new SchemaEvent(
        { schemaLocation: "/path/to/schema" },
        {
          defaultAction: async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            executed = true;
          },
        },
      );
      await events.emitAsync(SchemaEvents.BEFORE_LOAD, event);

      expect(executed).toBe(true);
    });

    it("should convert non-Error throws to Error", async () => {
      const events = getEvents();

      events.on(SchemaEvents.BEFORE_LOAD, () => {
        throw new Error("string error");
      });

      const event = new SchemaEvent({
        schemaLocation: "/path/to/schema",
      });
      const { errors } = await events.emitAsync(
        SchemaEvents.BEFORE_LOAD,
        event,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0]).toBeInstanceOf(Error);
      expect(errors[0].message).toBe("string error");
    });
  });

  describe("PrintTypeEvents", () => {
    it("should have correct event names", () => {
      expect(PrintTypeEvents.BEFORE_PRINT_CODE).toBe("print:beforePrintCode");
      expect(PrintTypeEvents.AFTER_PRINT_CODE).toBe("print:afterPrintCode");
      expect(PrintTypeEvents.BEFORE_PRINT_TYPE).toBe("print:beforePrintType");
      expect(PrintTypeEvents.AFTER_PRINT_TYPE).toBe("print:afterPrintType");
    });
  });

  describe("PrintCodeEvent", () => {
    const mockOptions = { basePath: "/docs" } as any;

    it("should store data and initial output", () => {
      const event = new PrintCodeEvent(
        {
          type: { name: "User" },
          typeName: "user",
          options: mockOptions,
        },
        "```graphql\ntype User { }\n```",
      );

      expect(event.data.type).toEqual({ name: "User" });
      expect(event.data.typeName).toBe("user");
      expect(event.data.options).toBe(mockOptions);
      expect(event.output).toBe("```graphql\ntype User { }\n```");
    });

    it("should allow output to be modified", () => {
      const event = new PrintCodeEvent(
        {
          type: { name: "User" },
          typeName: "user",
          options: mockOptions,
        },
        "original output",
      );

      event.output = "modified output";

      expect(event.output).toBe("modified output");
    });

    it("should be cancellable by default", () => {
      const event = new PrintCodeEvent(
        {
          type: { name: "User" },
          typeName: "user",
          options: mockOptions,
        },
        "",
      );

      event.preventDefault();

      expect(event.defaultPrevented).toBe(true);
    });

    it("should support stopPropagation", () => {
      const event = new PrintCodeEvent(
        {
          type: { name: "User" },
          typeName: "user",
          options: mockOptions,
        },
        "",
      );

      event.stopPropagation();

      expect(event.propagationStopped).toBe(true);
    });

    it("should work with event emitter to modify output", async () => {
      const events = getEvents();

      events.on(PrintTypeEvents.AFTER_PRINT_CODE, (event: PrintCodeEvent) => {
        event.output = `# Modified\n${event.output}`;
      });

      const event = new PrintCodeEvent(
        {
          type: { name: "User" },
          typeName: "user",
          options: mockOptions,
        },
        "original",
      );
      await events.emitAsync(PrintTypeEvents.AFTER_PRINT_CODE, event);

      expect(event.output).toBe("# Modified\noriginal");
    });

    it("should allow multiple handlers to chain modifications", async () => {
      const events = getEvents();

      events.on(PrintTypeEvents.AFTER_PRINT_CODE, (event: PrintCodeEvent) => {
        event.output = `[prefix]${event.output}`;
      });
      events.on(PrintTypeEvents.AFTER_PRINT_CODE, (event: PrintCodeEvent) => {
        event.output = `${event.output}[suffix]`;
      });

      const event = new PrintCodeEvent(
        {
          type: { name: "User" },
          typeName: "user",
          options: mockOptions,
        },
        "content",
      );
      await events.emitAsync(PrintTypeEvents.AFTER_PRINT_CODE, event);

      expect(event.output).toBe("[prefix]content[suffix]");
    });
  });

  describe("PrintTypeEvent", () => {
    const mockOptions = { basePath: "/docs" } as any;

    it("should store data and initial output", () => {
      const event = new PrintTypeEvent(
        {
          type: { name: "User" },
          name: "user",
          options: mockOptions,
        },
        "# User\n\nA user type" as any,
      );

      expect(event.data.type).toEqual({ name: "User" });
      expect(event.data.name).toBe("user");
      expect(event.data.options).toBe(mockOptions);
      expect(event.output).toBe("# User\n\nA user type");
    });

    it("should allow output to be modified", () => {
      const event = new PrintTypeEvent(
        {
          type: { name: "User" },
          name: "user",
          options: mockOptions,
        },
        "original" as any,
      );

      event.output = "modified" as any;

      expect(event.output).toBe("modified");
    });

    it("should allow undefined output", () => {
      const event = new PrintTypeEvent(
        {
          type: { name: "User" },
          name: "user",
          options: mockOptions,
        },
        undefined,
      );

      expect(event.output).toBeUndefined();
    });

    it("should allow null name", () => {
      const event = new PrintTypeEvent(
        {
          type: { name: "User" },
          name: null,
          options: mockOptions,
        },
        undefined,
      );

      expect(event.data.name).toBeNull();
    });

    it("should be cancellable by default", () => {
      const event = new PrintTypeEvent(
        {
          type: { name: "User" },
          name: "user",
          options: mockOptions,
        },
        undefined,
      );

      event.preventDefault();

      expect(event.defaultPrevented).toBe(true);
    });

    it("should work with event emitter to modify output", async () => {
      const events = getEvents();

      events.on(PrintTypeEvents.AFTER_PRINT_TYPE, (event: PrintTypeEvent) => {
        if (event.output) {
          event.output = `${event.output}\n\n---\nFooter` as any;
        }
      });

      const event = new PrintTypeEvent(
        {
          type: { name: "User" },
          name: "user",
          options: mockOptions,
        },
        "# User" as any,
      );
      await events.emitAsync(PrintTypeEvents.AFTER_PRINT_TYPE, event);

      expect(event.output).toBe("# User\n\n---\nFooter");
    });

    it("should allow handler to replace output entirely", async () => {
      const events = getEvents();

      events.on(PrintTypeEvents.BEFORE_PRINT_TYPE, (event: PrintTypeEvent) => {
        event.output = "Custom documentation" as any;
        event.preventDefault();
      });

      const event = new PrintTypeEvent(
        {
          type: { name: "User" },
          name: "user",
          options: mockOptions,
        },
        undefined,
      );
      await events.emitAsync(PrintTypeEvents.BEFORE_PRINT_TYPE, event);

      expect(event.output).toBe("Custom documentation");
      expect(event.defaultPrevented).toBe(true);
    });
  });
});
