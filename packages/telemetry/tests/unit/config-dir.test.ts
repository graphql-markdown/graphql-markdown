import { join } from "node:path";

import { resolveConfigDir } from "../../src/config-dir";

describe("resolveConfigDir", () => {
  test("win32 uses APPDATA", () => {
    expect(
      resolveConfigDir("win32", { APPDATA: "C:\\Users\\a\\AppData" }, "/h"),
    ).toBe(join("C:\\Users\\a\\AppData", "graphql-markdown"));
  });

  test("darwin uses Library/Preferences", () => {
    expect(resolveConfigDir("darwin", {}, "/home/a")).toBe(
      join("/home/a", "Library", "Preferences", "graphql-markdown"),
    );
  });

  test("linux uses XDG_CONFIG_HOME", () => {
    expect(resolveConfigDir("linux", { XDG_CONFIG_HOME: "/x" }, "/h")).toBe(
      join("/x", "graphql-markdown"),
    );
  });

  test("linux falls back to ~/.config", () => {
    expect(resolveConfigDir("linux", {}, "/home/a")).toBe(
      join("/home/a", ".config", "graphql-markdown"),
    );
  });
});
