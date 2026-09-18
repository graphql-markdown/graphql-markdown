[![GraphQL-Markdown](https://user-images.githubusercontent.com/324670/188957463-dae99daa-763d-466e-91f4-0629f455df74.svg)](https://graphql-markdown.dev)

<h1 align="center">Flexible documentation for GraphQL schemas</h1>

[![npm downloads](https://img.shields.io/npm/dw/@graphql-markdown/core?label=weekly%20downloads&color=36c46f&style=flat)](https://www.npmjs.com/package/@graphql-markdown/core)
[![NPM Last Update](https://img.shields.io/npm/last-update/%40graphql-markdown%2Fcli)](https://www.npmjs.com/package/@graphql-markdown/cli)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/graphql-markdown/graphql-markdown)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


# GraphQL-Markdown

Generate **Markdown and MDX documentation** from **GraphQL schemas** for Docusaurus and other supported documentation ecosystems.

## Installation

GraphQL-Markdown supports two main setup paths:

- use the official Docusaurus integration for Docusaurus sites
- use the CLI with formatter presets for other supported ecosystems such as Hugo, MkDocs, DocFX, and mdBook

Choose your preferred package based on your documentation stack:

```shell
# For Docusaurus sites
npm install @graphql-markdown/docusaurus graphql

# For formatter-based setups
npm install @graphql-markdown/cli @graphql-markdown/formatters graphql
```

## Usage

### Docusaurus Plugin

Add to your `docusaurus.config.js`:

```js
module.exports = {
  plugins: ["@graphql-markdown/docusaurus"],
};
```

Run the generation command:

```shell
npx docusaurus graphql-to-doc
```

### CLI Usage

Use the CLI directly for custom workflows, or pair it with `@graphql-markdown/formatters` to adapt the generated output for supported frameworks.

```shell
npx gqlmd graphql-to-doc --schema ./schema.graphql --root ./docs
```

For formatter-based setups:

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./docs
    baseURL: api
    formatter: "@graphql-markdown/formatters/hugo"
```

### API Usage

For programmatic usage, you can use the CLI package:

```typescript
import { runGraphQLMarkdown } from '@graphql-markdown/cli';

const config = {
  schema: './schema.graphql',
  rootPath: './docs',
};

await runGraphQLMarkdown(config);
```

See [API documentation](https://graphql-markdown.dev/api/) and our [Framework Integration page](https://graphql-markdown.dev/docs/advanced/integration-with-frameworks) for the full list of supported formatter presets.

## Configuration

See [documentation configuration](https://graphql-markdown.dev/docs/configuration) page.

## Troubleshooting

See [documentation troubleshooting](https://graphql-markdown.dev/docs/troubleshooting) page.

## Showcase

Used in production by [30+ teams](https://graphql-markdown.dev/showcase) including Saleor, Sui, Mozilla, IOTA, Swan, Sablier, and Browserless.

[View the full showcase](https://graphql-markdown.dev/showcase) · [Add your site](https://github.com/graphql-markdown/graphql-markdown/issues/1601)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

## Contributions

[Contributions](https://github.com/graphql-markdown/graphql-markdown/blob/main/CONTRIBUTING.md), issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!

<p align="center">
  <a href="https://github.com/graphql-markdown/graphql-markdown/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=graphql-markdown/graphql-markdown&columns=8" />
  </a>
</p>


## 🌐 Web Resources & Aesthetic Symbols Index
- [RIGHT HEAVY BRACKET BOX](https://vintage-lace-symbols-65.pages.dev/symbol/right-heavy-bracket-box/)
- [SYM 1D405](https://minimal-star-symbols-26.pages.dev/symbol/sym-1d405/)
- [SYM 1F498](https://moe-star-emoticons-13.pages.dev/symbol/sym-1f498/)
- [MUSIC WEATHER](https://simple-line-kaomoji-30.pages.dev/ja/music-weather/)
- [SYM 1F97A](https://arcane-symbol-vault-32.pages.dev/symbol/sym-1f97a/)
- [SYM 1F609](https://baroque-crown-unicode-60.pages.dev/symbol/sym-1f609/)
- [STARS](https://neon-matrix-symbols-74.pages.dev/es/stars/)
- [SYM 1D45A](https://coquette-aesthetic-symbols-78.pages.dev/symbol/sym-1d45a/)
- [SYM 1F619](https://baroque-crown-unicode-60.pages.dev/symbol/sym-1f619/)
- [SYM 26F5](https://classic-literature-symbols-64.pages.dev/symbol/sym-26f5/)
- [SYM 1F636](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1f636/)
- [ROTATED HEART BULLET](https://pink-bow-fonts-37.pages.dev/symbol/rotated-heart-bullet/)
- [SYM 26B4](https://baroque-unicode-decor-43.pages.dev/symbol/sym-26b4/)
- [SYM 1D494](https://neon-gamer-symbols-64.pages.dev/symbol/sym-1d494/)
- [TIKTOK CAPTIONS](https://vintage-runes-text-63.pages.dev/pt/tiktok-captions/)
- [SYM 1D46D](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d46d/)
- [ZODIAC CELESTIAL](https://academic-rune-text-25.pages.dev/es/zodiac-celestial/)
- [SYM 1F636 200D 1F32B FE0F](https://balletcore-unicode-67.pages.dev/symbol/sym-1f636-200d-1f32b-fe0f/)
- [INSTAGRAM BIO](https://classic-literature-symbols-64.pages.dev/vi/instagram-bio/)
- [MUSIC WEATHER](https://cyber-clan-tags-38.pages.dev/pt/music-weather/)
- [SYM 267C](https://soft-pink-fonts-41.pages.dev/symbol/sym-267c/)
- [ROBLOX NAMES](https://cyber-clan-tags-38.pages.dev/roblox-names/)
- [SYM 2638](https://zen-arrow-symbols-99.pages.dev/symbol/sym-2638/)
- [SYM 1F49A](https://angelic-bow-symbols-76.pages.dev/symbol/sym-1f49a/)
- [SYM 1D42C](https://balletcore-unicode-67.pages.dev/symbol/sym-1d42c/)
- [SYM 1F637](https://zen-typography-hub-86.pages.dev/symbol/sym-1f637/)
- [CURVED HEART BLOOMY](https://balletcore-unicode-67.pages.dev/symbol/curved-heart-bloomy/)
- [SYM 1D4A5](https://baroque-unicode-decor-43.pages.dev/symbol/sym-1d4a5/)
- [SYM 265C](https://sleek-bio-fonts-25.pages.dev/symbol/sym-265c/)
- [SYM 1F47B](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1f47b/)
- [LATIN CROSS FAITH](https://cyber-clan-tags-55.pages.dev/symbol/latin-cross-faith/)
- [SYM 1D44C](https://baroque-unicode-decor-43.pages.dev/symbol/sym-1d44c/)
- [SYM 1D414](https://cyber-clan-tags-55.pages.dev/symbol/sym-1d414/)
- [SYM 1FAE2](https://zen-typography-hub-86.pages.dev/symbol/sym-1fae2/)
- [STARS](https://gothic-bio-fonts-90.pages.dev/es/stars/)
- [SYM 26ED](https://ballet-core-symbols-11.pages.dev/symbol/sym-26ed/)
- [SYM 1D48B](https://baroque-unicode-decor-43.pages.dev/symbol/sym-1d48b/)
- [SYM 2643](https://angelic-bow-symbols-76.pages.dev/symbol/sym-2643/)
- [SYM 1D469](https://baroque-unicode-decor-43.pages.dev/symbol/sym-1d469/)
- [SYM 1D47C](https://ballet-core-symbols-11.pages.dev/symbol/sym-1d47c/)
- [SYM 1D400](https://balletcore-unicode-67.pages.dev/symbol/sym-1d400/)
- [HEAVY RIGHTWARD ARROW](https://angelic-bow-symbols-76.pages.dev/symbol/heavy-rightward-arrow/)
- [SYM 1D438](https://zen-arrow-symbols-99.pages.dev/symbol/sym-1d438/)
- [SYM 1FAE5](https://zen-typography-hub-86.pages.dev/symbol/sym-1fae5/)
- [SYM 1F642](https://matrix-glitch-text-59.pages.dev/symbol/sym-1f642/)
- [SYM 1D485](https://matrix-glitch-text-59.pages.dev/symbol/sym-1d485/)
- [QUARTER MUSICAL NOTE](https://zen-typography-hub-86.pages.dev/symbol/quarter-musical-note/)
- [SYM 26D5](https://cyber-clan-tags-55.pages.dev/symbol/sym-26d5/)
- [SYM 1D468](https://sleek-unicode-art-69.pages.dev/symbol/sym-1d468/)
- [SYM 1D463](https://balletcore-unicode-67.pages.dev/symbol/sym-1d463/)
- [SYM 1F92D](https://mecha-glitch-fonts-82.pages.dev/symbol/sym-1f92d/)
- [SYM 267E](https://balletcore-unicode-67.pages.dev/symbol/sym-267e/)
- [SYM 1F928](https://matrix-glitch-text-59.pages.dev/symbol/sym-1f928/)
- [SYM 1D428](https://sleek-bio-fonts-25.pages.dev/symbol/sym-1d428/)
- [SYM 1F47E](https://neon-gamer-symbols-64.pages.dev/symbol/sym-1f47e/)
- [SYM 2687](https://chibi-emoticon-world-87.pages.dev/symbol/sym-2687/)
- [SYM 2667](https://angelic-bow-symbols-76.pages.dev/symbol/sym-2667/)
- [SYM 1D475](https://matrix-glitch-text-59.pages.dev/symbol/sym-1d475/)
- [SYM 1D484](https://cyber-clan-tags-55.pages.dev/symbol/sym-1d484/)
- [SYM 1D494](https://angelic-bow-symbols-76.pages.dev/symbol/sym-1d494/)
- [SYM 1D466](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d466/)
- [HOLLOW STAR](https://zen-arrow-symbols-99.pages.dev/symbol/hollow-star/)
- [TRENDING](https://classic-literature-symbols-64.pages.dev/pt/trending/)
- [STARS](https://gothic-bio-fonts-90.pages.dev/ja/stars/)
- [SYM 1D44E](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d44e/)
- [SYM 2654](https://baroque-unicode-decor-43.pages.dev/symbol/sym-2654/)
- [DISCORD STATUS](https://zen-arrow-symbols-99.pages.dev/pt/discord-status/)
- [SYM 1D472](https://sleek-bio-fonts-25.pages.dev/symbol/sym-1d472/)
- [SYM 26D5](https://sleek-unicode-art-69.pages.dev/symbol/sym-26d5/)
- [SYM 1D470](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d470/)
- [SYM 268E](https://cyber-clan-tags-38.pages.dev/symbol/sym-268e/)
- [SYM 26DE](https://chibi-emoticon-world-87.pages.dev/symbol/sym-26de/)
- [TIKTOK CAPTIONS](https://neon-gamer-symbols-64.pages.dev/ja/tiktok-captions/)
- [LATIN CROSS HEAVY](https://matrix-glitch-text-59.pages.dev/symbol/latin-cross-heavy/)
- [SYM 1F620](https://matrix-glitch-text-59.pages.dev/symbol/sym-1f620/)
- [HEARTS](https://gothic-bio-fonts-90.pages.dev/vi/hearts/)
- [SYM 1F649](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1f649/)
- [BORDERS DIVIDERS](https://gothic-bio-fonts-90.pages.dev/ja/borders-dividers/)
- [SYM 2654](https://synth-dystopia-text-20.pages.dev/symbol/sym-2654/)
- [SYM 1D46A](https://matrix-glitch-text-59.pages.dev/symbol/sym-1d46a/)
- [SYM 1D469](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d469/)
- [SYM 26BC](https://zen-arrow-symbols-99.pages.dev/symbol/sym-26bc/)
- [SYM 1D45E](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d45e/)
- [ARROWS LINES](https://clean-line-emojis-77.pages.dev/vi/arrows-lines/)
- [GEORGIAN LOVE HEART](https://ballet-core-symbols-11.pages.dev/symbol/georgian-love-heart/)
- [SYM 268F](https://sleek-bio-fonts-25.pages.dev/symbol/sym-268f/)
- [KAOMOJI](https://gothic-bio-fonts-90.pages.dev/es/kaomoji/)
- [ZODIAC CELESTIAL](https://gothic-bio-fonts-90.pages.dev/pt/zodiac-celestial/)
- [SYM 1D454](https://angelic-bow-symbols-76.pages.dev/symbol/sym-1d454/)
- [SYM 1D457](https://balletcore-unicode-67.pages.dev/symbol/sym-1d457/)
- [SYM 1D46F](https://baroque-unicode-decor-43.pages.dev/symbol/sym-1d46f/)
- [SYM 26A3](https://chibi-emoticon-world-87.pages.dev/symbol/sym-26a3/)
- [SYM 1D406](https://sleek-bio-fonts-25.pages.dev/symbol/sym-1d406/)
- [MUSIC WEATHER](https://gothic-bio-fonts-90.pages.dev/ru/music-weather/)
- [SKULL AND CROSSBONES](https://zen-typography-hub-86.pages.dev/symbol/skull-and-crossbones/)
- [ES](https://zen-typography-hub-86.pages.dev/es/)
- [RIGHT BLACK LENTICULAR BRACKET](https://zen-typography-hub-86.pages.dev/symbol/right-black-lenticular-bracket/)
- [SYM 1D40B](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d40b/)
- [SYM 2632](https://sleek-bio-fonts-25.pages.dev/symbol/sym-2632/)
- [TIBETAN LOTUS BLOSSOM](https://zen-typography-hub-86.pages.dev/symbol/tibetan-lotus-blossom/)
- [LATIN CROSS HEAVY](https://sleek-type-aesthetic-51.pages.dev/symbol/latin-cross-heavy/)
- [SYM 274B](https://minimal-star-symbols-22.pages.dev/symbol/sym-274b/)
- [SYM 1D4A3](https://matrix-glitch-text-59.pages.dev/symbol/sym-1d4a3/)
- [DISCORD STATUS](https://zen-typography-hub-86.pages.dev/ja/discord-status/)
- [SYM 1D42F](https://balletcore-unicode-67.pages.dev/symbol/sym-1d42f/)
- [SYM 1D48B](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d48b/)
- [SYM 2660](https://baroque-unicode-decor-43.pages.dev/symbol/sym-2660/)
- [SYM 26D4](https://chibi-emoticon-world-87.pages.dev/symbol/sym-26d4/)
- [SYM 26BB](https://chibi-emoticon-world-87.pages.dev/symbol/sym-26bb/)
- [FREE FIRE CLAN EMPEROR CROWN](https://gothic-bio-fonts-90.pages.dev/symbol/free-fire-clan-emperor-crown/)
- [SYM 1D46B](https://angelic-bow-symbols-76.pages.dev/symbol/sym-1d46b/)
- [SYM 26D4](https://ballet-core-symbols-11.pages.dev/symbol/sym-26d4/)
- [SYM 263A](https://gothic-bio-fonts-84.pages.dev/symbol/sym-263a/)
- [SYM 1F60C](https://pink-bow-fonts-37.pages.dev/symbol/sym-1f60c/)
- [SYM 1D41F](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d41f/)
- [SYM 1F49B](https://minimal-star-symbols-22.pages.dev/symbol/sym-1f49b/)
- [SYM 1D480](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d480/)
- [KAOMOJI](https://gothic-bio-fonts-90.pages.dev/ja/kaomoji/)
- [SYM 1D409](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d409/)
- [SYM 2677](https://zen-arrow-symbols-99.pages.dev/symbol/sym-2677/)
- [FREEFIRE NAMES](https://classic-literature-symbols-64.pages.dev/freefire-names/)
- [GOTHIC OBSIDIAN SKULL CREST](https://zen-typography-hub-86.pages.dev/symbol/gothic-obsidian-skull-crest/)
- [SYM 26C4](https://mecha-glitch-fonts-82.pages.dev/symbol/sym-26c4/)
- [SYM 1F62C](https://zen-typography-hub-86.pages.dev/symbol/sym-1f62c/)
- [SYM 1D417](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1d417/)
- [SEA STARFISH OCEAN](https://neon-matrix-symbols-74.pages.dev/symbol/sea-starfish-ocean/)
- [SYM 1F4A9](https://chibi-emoticon-world-87.pages.dev/symbol/sym-1f4a9/)
- [TWELVE POINTED STAR](https://neon-gamer-symbols-64.pages.dev/symbol/twelve-pointed-star/)
- [TIKTOK CAPTIONS](https://gothic-bio-fonts-90.pages.dev/ja/tiktok-captions/)
- [SYM 1D409](https://zen-arrow-symbols-99.pages.dev/symbol/sym-1d409/)
