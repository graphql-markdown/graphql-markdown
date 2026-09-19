// Augments Nuxt's AppConfig type with this layer's own `gqlmd` key, so
// `useAppConfig().gqlmd` resolves to a real type instead of `unknown`
// wherever a consuming project's own app.config.ts doesn't redeclare it.
declare module "@nuxt/schema" {
  interface AppConfig {
    gqlmd: {
      siteTitle: string;
      githubUrl?: string;
      shikiTheme: string;
      baseURL: string;
    };
  }
}

export {};
