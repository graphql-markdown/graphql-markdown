/**
 * The built-in homepage template, inlined.
 *
 * The same content ships as `assets/generated.md` so anyone can point
 * `homepage` at it, copy it, or diff against it. Inlining it here means the
 * default path never touches the filesystem: rendering the homepage was the
 * last filesystem *read* on the render path, and a write-only output adapter
 * has no way to satisfy one.
 *
 * `assets/generated.md` remains the canonical artifact. A unit test asserts the
 * two are identical, so they cannot drift.
 *
 * @internal
 */
export const DEFAULT_HOMEPAGE_TEMPLATE = `---
id: schema
slug: ##baseURL##
title: Schema Documentation
sidebar_position: 1
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
sidebar_class_name: navbar__toggle
---

This documentation has been automatically generated from the GraphQL schema with [GraphQL-Markdown](https://graphql-markdown.dev/).
`;
