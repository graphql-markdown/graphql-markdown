/**
 * Integration tests for print events (afterPrintTypeHook, etc.)
 *
 * Tests the full flow from MDX module registration through event emission.
 */
import { getEvents, resetEvents } from "../../src/event-emitter";
import { registerMDXEventHandlers } from "../../src/event-handlers";
import { PrintTypeEvents } from "../../src/events/print-type-events";

describe("Print Events Integration", () => {
  beforeEach(() => {
    resetEvents();
  });

  afterEach(() => {
    resetEvents();
  });

  describe("afterPrintTypeHook", () => {
    it("should register and call afterPrintTypeHook when event is emitted", async () => {
      // Create MDX module with afterPrintTypeHook
      const hookCalled: string[] = [];
      const mdxModule = {
        afterPrintTypeHook: async (event: { output: string }) => {
          hookCalled.push("afterPrintTypeHook called");
          event.output = "AFTER PRINT TYPE HOOK";
        },
      };

      // Register MDX event handlers FIRST (this calls resetEvents internally)
      registerMDXEventHandlers(mdxModule);

      // Get events singleton AFTER registration (to get the same instance)
      const events = getEvents();

      // Verify the handler was registered
      const listeners = events.listeners(PrintTypeEvents.AFTER_PRINT_TYPE);
      console.log(
        "Registered listeners for print:afterPrintType:",
        listeners.length,
      );
      expect(listeners.length).toBe(1);

      // Create a mock event similar to what Printer would create
      const mockEvent = {
        data: { type: {}, name: "TestType", options: {} },
        output: "original output",
        defaultPrevented: false,
        propagationStopped: false,
        preventDefault(): void {
          this.defaultPrevented = true;
        },
        stopPropagation(): void {
          this.propagationStopped = true;
        },
        async runDefaultAction(): Promise<void> {
          return void 0;
        },
      };

      // Emit the event manually
      await events.emitAsync(PrintTypeEvents.AFTER_PRINT_TYPE, mockEvent);

      // Verify the hook was called
      console.log("Hook calls:", hookCalled);
      expect(hookCalled).toContain("afterPrintTypeHook called");

      // Verify the output was modified
      console.log("Event output:", mockEvent.output);
      expect(mockEvent.output).toBe("AFTER PRINT TYPE HOOK");
    });

    it("should emit events in the correct order", async () => {
      const eventOrder: string[] = [];

      const mdxModule = {
        beforePrintTypeHook: async () => {
          eventOrder.push("beforePrintType");
        },
        afterPrintTypeHook: async () => {
          eventOrder.push("afterPrintType");
        },
        beforePrintCodeHook: async () => {
          eventOrder.push("beforePrintCode");
        },
        afterPrintCodeHook: async () => {
          eventOrder.push("afterPrintCode");
        },
      };

      // Register handlers first
      registerMDXEventHandlers(mdxModule);

      // Then get the events singleton (after reset)
      const events = getEvents();

      // Simulate the order that Printer would emit events
      const mockEvent = {
        data: {},
        output: "",
        defaultPrevented: false,
        propagationStopped: false,
        preventDefault(): void {
          this.defaultPrevented = true;
        },
        stopPropagation(): void {
          this.propagationStopped = true;
        },
        async runDefaultAction(): Promise<void> {
          return void 0;
        },
      };

      await events.emitAsync(PrintTypeEvents.BEFORE_PRINT_TYPE, mockEvent);
      await events.emitAsync(PrintTypeEvents.BEFORE_PRINT_CODE, mockEvent);
      await events.emitAsync(PrintTypeEvents.AFTER_PRINT_CODE, mockEvent);
      await events.emitAsync(PrintTypeEvents.AFTER_PRINT_TYPE, mockEvent);

      console.log("Event order:", eventOrder);

      // Verify event order
      expect(eventOrder).toEqual([
        "beforePrintType",
        "beforePrintCode",
        "afterPrintCode",
        "afterPrintType",
      ]);
    });
  });
});
