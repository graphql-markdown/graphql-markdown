# GraphQL API Documentation

This is a GraphQL API reference site built with [GraphQL Markdown](https://graphql-markdown.dev) and [Nuxt](https://nuxt.com).

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate documentation from your GraphQL schema:**
   ```bash
   npm run generate
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The site will be available at `http://localhost:3000`.

## Customization

### Site Title and Branding

Edit `app/app.config.ts` to customize the site title and appearance:

```typescript
export default defineAppConfig({
  gqlmd: {
    siteTitle: 'My API',
    githubUrl: 'https://github.com/example/repo',
  },
});
```

### Your GraphQL Schema

Replace the example schema in `schema/example.graphql` with your own GraphQL schema file. The path is configured in `generate-docs.ts`:

```typescript
export const generate = createGenerateDocs({
  schema: './schema/your-schema.graphql',
});
```

### Advanced Configuration

For more advanced customization options, see the [@graphql-markdown/nuxt-theme documentation](https://graphql-markdown.dev).

## Building for Production

```bash
npm run build
npm run preview
```

## Learn More

- [GraphQL Markdown Documentation](https://graphql-markdown.dev)
- [Nuxt Documentation](https://nuxt.com)
- [GraphQL Documentation](https://graphql.org)
