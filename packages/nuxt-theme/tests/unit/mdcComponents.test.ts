import { describe, it, expect, vi, beforeEach } from "vitest";

const hooks = vi.hoisted(() => {
  return {
    nuxt: {
      options: {},
      hook: vi.fn(),
    },
  };
});

vi.mock("@nuxt/kit", () => {
  return {
    defineNuxtModule: (definition: unknown) => {
      return definition;
    },
    useNuxt: () => {
      return hooks.nuxt;
    },
  };
});

const mod = await import("../../modules/mdc-components");

interface FakeComponent {
  pascalName: string;
  global?: boolean;
}

const makeComponents = (names: string[]): FakeComponent[] => {
  return names.map((pascalName) => {
    return { pascalName, global: false };
  });
};

describe("mdc-components module", () => {
  beforeEach(() => {
    hooks.nuxt.hook.mockReset();
  });

  it("exposes the injected component names", () => {
    expect([...mod.MDC_INJECTED_COMPONENTS].sort()).toStrictEqual([
      "UAlert",
      "UBadge",
    ]);
  });

  it("markInjectedComponentsGlobal sets global on UBadge and UAlert only", () => {
    const components = makeComponents(["UBadge", "UAlert", "UButton", "Foo"]);

    mod.markInjectedComponentsGlobal(
      components as unknown as Parameters<
        typeof mod.markInjectedComponentsGlobal
      >[0],
    );

    expect(
      components.map(({ pascalName, global }) => {
        return { pascalName, global };
      }),
    ).toStrictEqual([
      { pascalName: "UBadge", global: true },
      { pascalName: "UAlert", global: true },
      { pascalName: "UButton", global: false },
      { pascalName: "Foo", global: false },
    ]);
  });

  it("markInjectedComponentsGlobal is a no-op for an empty list", () => {
    expect(() => {
      mod.markInjectedComponentsGlobal([]);
    }).not.toThrow();
  });

  it("setup registers a components:extend hook that marks injected components global", () => {
    (mod.default as unknown as { setup: () => void }).setup();

    expect(hooks.nuxt.hook).toHaveBeenCalledTimes(1);
    const [hookName, handler] = hooks.nuxt.hook.mock.calls[0];
    expect(hookName).toBe("components:extend");

    const components = makeComponents(["UBadge", "UAlert", "UIcon"]);
    (handler as (components: FakeComponent[]) => void)(components);

    expect(
      components.map(({ global }) => {
        return global;
      }),
    ).toStrictEqual([true, true, false]);
  });
});
