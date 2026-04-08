VERSION 0.8

ARG nodeVersion="lts"
ARG npmVersion="latest"
ARG --global docusaurusVersion="latest"
ARG --global docusaurusProject="docusaurus-gqlmd"
ARG --global gqlmdCliProject="cli-gqlmd"
ARG --global testTimeout="5000"
ARG --global coverage="true"

FROM docker.io/library/node:$nodeVersion-alpine
WORKDIR /graphql-markdown
ENV NODE_ENV=ci
ENV HUSKY=0
ENV NODE_OPTIONS=--dns-result-order=ipv4first
ENV TURBO_CONCURRENCY=50%
RUN --mount=type=cache,target=/root/.npm npm install --global npm@$npmVersion bun
RUN node --version
RUN npm --version
RUN bun --version

deps:
  COPY package.json bun.lock ./
  COPY tsconfig.json tsconfig.base.json turbo.json typedoc.config.mjs ./
  COPY --dir packages ./packages
  RUN --mount=type=cache,target=/root/.bun bun ci --silent
  # Cache node_modules
  SAVE ARTIFACT node_modules AS LOCAL node_modules

build:
  FROM +deps
  RUN bun run clean
  RUN bun run build

lint:
  FROM +build
  RUN bun run ts:check
  RUN bun run prettier
  RUN bun run lint

unit-test:
  FROM +lint
  DO +INSTALL_JEST
  RUN bun run test:unit

integration-test:
  FROM +lint
  DO +INSTALL_JEST
  RUN bun run test:integration

mutation-test:
  FROM +build
  RUN bun run stryker
  IF [ ! $(EARTHLY_CI) ]
    SAVE ARTIFACT reports AS LOCAL ./reports
  END

build-package:
  FROM +build
  ARG --required package
  WORKDIR /graphql-markdown/packages/$package
  RUN bun pm pack --quiet --filename /graphql-markdown/graphql-markdown-$package.tgz
  WORKDIR /graphql-markdown
  SAVE ARTIFACT graphql-markdown-$package.tgz

build-docusaurus-project:
  FROM +build
  WORKDIR /
  IF [ "$docusaurusVersion" = "2" ]
    RUN --mount=type=cache,target=/root/.bun bunx --quiet create-docusaurus@$docusaurusVersion "$docusaurusProject" classic --skip-install
  ELSE
    RUN --mount=type=cache,target=/root/.bun bunx --quiet create-docusaurus@$docusaurusVersion "$docusaurusProject" classic --skip-install --javascript 
  END
  WORKDIR /$docusaurusProject
  RUN rm -rf docs; rm -rf blog; rm -rf src; rm -rf static/img
  DO +INSTALL_DOCUSAURUS

setup-cli-project:
  FROM +build
  RUN mkdir /$gqlmdCliProject
  WORKDIR /$gqlmdCliProject
  DO +INSTALL_GRAPHQL
  DO +INSTALL_GQLMD
  RUN npm install --save ./graphql-markdown-cli.tgz

setup-docusaurus-project:
  FROM +build-docusaurus-project
  WORKDIR /$docusaurusProject
  COPY --dir ./website/static/img ./static/img
  COPY --dir ./website/src/css ./src/css
  DO +INSTALL_GRAPHQL
  DO +INSTALL_GQLMD
  RUN npm install --save ./graphql-markdown-cli.tgz ./graphql-markdown-docusaurus.tgz
  COPY ./tests/e2e/docusaurus/__data__/scripts/config-plugin.mjs ./config-plugin.mjs
  RUN node config-plugin.mjs

smoke-docusaurus-test:
  FROM +setup-docusaurus-project
  WORKDIR /$docusaurusProject
  COPY ./tests/e2e/helpers/e2e-test-webpack-plugin ./e2e-test-webpack-plugin
  RUN npm install --save ./e2e-test-webpack-plugin # Custom plugin for silencing webpack warnings [webpack.cache.PackFileCacheStrategy] 
  DO +SMOKE_TEST --package=docusaurus

smoke-docusaurus-run:
  FROM +smoke-docusaurus-test
smoke-cli-test:
  FROM +setup-cli-project
  WORKDIR /$gqlmdCliProject
  COPY ./tests/e2e/cli/__data__/graphql-doc-generator-multi-instance.config.mjs ./graphql.config.mjs
  DO +SMOKE_TEST --package=cli

build-docusaurus-examples:
  FROM +setup-docusaurus-project
  WORKDIR /$docusaurusProject
  RUN --mount=type=cache,target=/root/.npm npm install --save prettier
  DO +BUILD_EXAMPLES

build-cli-examples:
  FROM +setup-cli-project
  WORKDIR /$gqlmdCliProject
  RUN --mount=type=cache,target=/root/.npm npm install --save prettier
  COPY ./tests/e2e/__data__/graphql.config.mjs ./graphql.config.mjs
  DO +BUILD_EXAMPLES --command=gqlmd

build-api-docs:
  FROM +build
  COPY ./docs/__api/__index.md /graphql-markdown/docs/__api/__index.md
  RUN bun run docs:api
  SAVE ARTIFACT ./api

build-docs:
  FROM docker.io/library/node:$nodeVersion-alpine
  COPY ./website ./
  COPY (+build-docusaurus-examples/examples) ./examples
  COPY (+build-api-docs/api) ./api
  COPY --dir docs .
  RUN --mount=type=cache,target=/root/.npm npm ci
  RUN --mount=type=cache,target=/root/.npm npx update-browserslist-db@latest
  RUN NODE_OPTIONS="--max-old-space-size=4096" DOCUSAURUS_IGNORE_SSG_WARNINGS=true npm run build
  SAVE ARTIFACT --force ./build AS LOCAL build

build-image:
  FROM +build-docs
  EXPOSE 8080
  ENTRYPOINT ["npm", "run", "serve", "--",  "--host=0.0.0.0", "--port=8080"]
  SAVE IMAGE graphql-markdown:docs

all:
  BUILD +lint
  BUILD +build
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-docusaurus-test

# --- UDCs ---

INSTALL_JEST:
  FUNCTION
  RUN --mount=type=cache,target=/root/.bun bun install --silent --global jest

GQLMD:
  FUNCTION
  ARG id
  ARG options
  ARG command=docusaurus
  RUN mkdir -p docs
  IF [ ! $id ]
    RUN bunx $command graphql-to-doc $options 2>&1 | tee ./run.log
  ELSE
    RUN bunx $command graphql-to-doc:${id} $options 2>&1 | tee ./run.log
  END
  RUN test `grep -c -i "An error occurred" run.log` -eq 0 && echo "Success" || (echo "Failed with errors"; exit 1) 

INSTALL_GQLMD:
  FUNCTION
  FOR package IN $(node /graphql-markdown/packages/tooling-config/scripts/build-packages.mjs)
    COPY (+build-package/graphql-markdown-${package}.tgz --package=${package}) ./
  END
  RUN --mount=type=cache,target=/root/.npm \
    packages=$(node /graphql-markdown/packages/tooling-config/scripts/build-packages.mjs | grep -vE "^(cli|docusaurus)$" | sed 's|^|./graphql-markdown-|; s|$|.tgz|' | tr '\n' ' ') && \
    npm install --save $packages

SMOKE_TEST:
  FUNCTION
  ARG package
  COPY ./tests/e2e/__data__ ./data
  COPY ./tests/e2e/__data__/.graphqlrc ./.graphqlrc
  COPY ./tests/e2e/helpers/cli.mjs ./__tests__/helpers/cli.mjs
  COPY ./tests/e2e/$package/__data__ ./data
  COPY ./tests/e2e/$package/specs ./__tests__/e2e/specs
  COPY ./tests/e2e/$package/jest.config.mjs ./jest.config.mjs
  RUN NODE_OPTIONS=--experimental-vm-modules npx --yes jest --runInBand --config ./jest.config.mjs

BUILD_EXAMPLES:
  FUNCTION
  ARG command=docusaurus
  LET folderDocs="examples"
  LET folderExample="default"
  LET idExample="default"
  RUN mkdir $folderDocs
  DO +GQLMD --command=$command --options="--homepage data/anilist.md --schema https://graphql.anilist.co/ --base . --link /${folderDocs}/${folderExample} --force --pretty --deprecated group"
  RUN mv docs ./$folderDocs/$folderExample
  SET folderExample="group-by"
  SET idExample="schema_with_grouping"
  DO +GQLMD --command=$command --id="${idExample}" --options="--homepage data/groups.md --schema data/${idExample}.graphql --groupByDirective @doc(category|=Common) --base . --link /${folderDocs}/${folderExample} --skip @noDoc --index --noParentType --noRelatedType --deprecated group --hierarchy entity"
  RUN mv docs ./$folderDocs/$folderExample
  SAVE ARTIFACT ./$folderDocs

INSTALL_DOCUSAURUS:
  FUNCTION
  RUN --mount=type=cache,target=/root/.npm npm install
  RUN --mount=type=cache,target=/root/.npm npm update @docusaurus/core @docusaurus/preset-classic

INSTALL_GRAPHQL:
  FUNCTION
  RUN --mount=type=cache,target=/root/.npm npm install --save graphql @graphql-tools/url-loader @graphql-tools/graphql-file-loader
