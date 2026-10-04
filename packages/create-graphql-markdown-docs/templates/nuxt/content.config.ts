// content.config.ts
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Registers the generated Markdown pages; the formatter emits `.md` so that
    // Nuxt Content's search indexer picks them up.
    content: defineCollection({
      type: 'page',
      source: 'api-reference/**/*.md'
    })
  }
})
