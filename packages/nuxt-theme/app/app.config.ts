import { DEFAULT_BASE_URL } from "../constants";

export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      neutral: "zinc",
    },
    // Generated headings already contain their own `#anchor` link, so the prose
    // heading components must not wrap them in a second one — nested <a>
    // elements get reparented by the HTML parser and break hydration.
    // `ProseH1`–`ProseH4`'s own `anchor` prop already defaults to `false`
    // (verified against the installed @nuxt/ui version's own type
    // declarations), so no override is needed here.
  },
  gqlmd: {
    siteTitle: "GraphQL API",
    githubUrl: undefined as string | undefined,
    shikiTheme: "github-dark",
    baseURL: DEFAULT_BASE_URL,
  },
});
