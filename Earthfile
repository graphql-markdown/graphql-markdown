VERSION 0.8

ARG nodeVersion="lts"
ARG npmVersion="latest"
ARG --global docusaurusVersion="latest"
ARG --global docusaurusProject="docusaurus-gqlmd"
ARG --global gqlmdCliProject="cli-gqlmd"
ARG --global testTimeout="5000"
ARG --global coverage="true"
ARG --global turboOutputLogs="errors-only"

FROM docker.io/library/node:$nodeVersion-alpine
ENV NODE_ENV=ci
ENV HUSKY=0
ENV NODE_OPTIONS=--dns-result-order=ipv4first
ENV TURBO_CONCURRENCY=50%

alpine: 
  WORKDIR /graphql-markdown
  RUN --mount=type=cache,target=/root/.npm npm install --global npm@$npmVersion bun
  RUN node --version
  RUN npm --version
  RUN bun --version

assets:
  FROM scratch
  COPY --dir ./website/static/img ./static/img
  COPY --dir ./website/src/css ./src/css
  COPY --dir ./docs ./docs
  COPY --dir ./tests/e2e/__data__ ./data
  COPY --dir ./tests/e2e/docusaurus/__data__ ./docusaurus
  SAVE ARTIFACT ./static/img
  SAVE ARTIFACT ./src/css
  SAVE ARTIFACT ./docs
  SAVE ARTIFACT ./data
  SAVE ARTIFACT ./docusaurus

deps:
  FROM +alpine
  COPY package.json bun.lock ./
  COPY tsconfig.json tsconfig.base.json turbo.json ./
  COPY --dir packages ./packages
  RUN --mount=type=cache,target=/root/.bun bun ci --silent
  # Cache node_modules
  SAVE ARTIFACT node_modules AS LOCAL node_modules

build:
  FROM +deps
  RUN bun run clean --output-logs "$turboOutputLogs"
  RUN bun run build --output-logs "$turboOutputLogs"

lint:
  FROM +build
  RUN bun run ts:check --output-logs "$turboOutputLogs"
  RUN bun run prettier --output-logs "$turboOutputLogs"
  RUN bun run lint --output-logs "$turboOutputLogs"

unit-test:
  FROM +lint
  DO +INSTALL_JEST
  RUN bun run test:unit --output-logs "$turboOutputLogs"

integration-test:
  FROM +lint
  DO +INSTALL_JEST
  RUN bun run test:integration --output-logs "$turboOutputLogs"

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
  COPY (+assets/img) ./static/img
  COPY (+assets/css) ./src/css
  DO +INSTALL_GRAPHQL
  DO +INSTALL_GQLMD
  RUN npm install --save ./graphql-markdown-cli.tgz ./graphql-markdown-docusaurus.tgz
  COPY ./tests/e2e/docusaurus/__data__/scripts/config-plugin.mjs ./config-plugin.mjs
  RUN node config-plugin.mjs

all:
  BUILD +lint
  BUILD +build
  BUILD +unit-test
  BUILD +integration-test

# --- UDCs ---

INSTALL_JEST:
  FUNCTION
  RUN --mount=type=cache,target=/root/.bun bun install --silent --global jest

GQLMD:
  FUNCTION
  ARG id
  ARG options
  ARG command="docusaurus"
  ARG runner="bunx"
  RUN mkdir -p docs
  LET gqlmd=graphql-to-doc
  IF [ $id ]
    SET gqlmd=${gqlmd}:${id}
  END
  RUN echo "Running command: $runner $command $gqlmd $options"
  RUN $runner $command $gqlmd $options 2>&1 | tee ./run.log
  RUN test `grep -c -i "An error occurred" run.log` -eq 0 && echo "Success" || (echo "Failed with errors"; exit 1)

INSTALL_DOCUSAURUS:
  FUNCTION
  RUN --mount=type=cache,target=/root/.npm npm install
  RUN --mount=type=cache,target=/root/.npm npm update @docusaurus/core @docusaurus/preset-classic
  # Pin webpack to <5.95.0: webpackbar (used by Docusaurus) passes { name, color, reporters, reporter }
  # to ProgressPlugin which webpack 5.95+ rejects as unknown properties (strict schema validation).
  RUN --mount=type=cache,target=/root/.npm npm install --save-exact webpack@5.94.0

INSTALL_GQLMD:
  FUNCTION
  FOR package IN $(node /graphql-markdown/packages/tooling-config/scripts/build-packages.mjs)
    COPY (+build-package/graphql-markdown-${package}.tgz --package=${package}) ./
  END
  RUN --mount=type=cache,target=/root/.npm \
    packages=$(node /graphql-markdown/packages/tooling-config/scripts/build-packages.mjs | grep -vE "^(cli|docusaurus)$" | sed 's|^|./graphql-markdown-|; s|$|.tgz|' | tr '\n' ' ') && \
    npm install --save $packages

INSTALL_GRAPHQL:
  FUNCTION
  RUN --mount=type=cache,target=/root/.npm npm install --save graphql @graphql-tools/url-loader @graphql-tools/graphql-file-loader
