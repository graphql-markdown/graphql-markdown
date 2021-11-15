ARG nodeVersion=lts
FROM node:$nodeVersion-alpine
WORKDIR /graphql-markdown
ENV NPM_TOKEN=""

deps:
    COPY . .
    RUN yarn install --frozen-lockfile

lint: 
  ARG flag
  FROM +deps
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    RUN yarn prettier --write
    RUN yarn lint --fix
    SAVE ARTIFACT --if-exists ./ AS LOCAL ./
  ELSE
    ENV NODE_ENV=ci
    RUN yarn prettier --check
    RUN yarn lint
  END

unit-test:
  ARG flag
  FROM +deps
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/unit -u
    SAVE ARTIFACT --if-exists tests/unit AS LOCAL ./tests/unit
  ELSE
    ENV NODE_ENV=ci
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/unit
  END

integration-test:
  ARG flag
  FROM +deps
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/integration -u
    SAVE ARTIFACT --if-exists tests/integration AS LOCAL ./tests/integration
  ELSE
    ENV NODE_ENV=ci
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/integration
  END

mutation-test:
  FROM +deps
  RUN yarn stryker run --logLevel error --inPlace
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    SAVE ARTIFACT reports AS LOCAL ./reports
  END

build-package:
  FROM +deps
  RUN yarn pack --filename docusaurus2-graphql-doc-generator.tgz

build-docusaurus:
  FROM +build-package
  WORKDIR /
  RUN npx --quiet @docusaurus/init@latest init docusaurus2 classic
  WORKDIR /docusaurus2
  RUN rm -rf docs; rm -rf blog; rm -rf src; rm -rf static/img
  RUN yarn install
  RUN yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest

smoke-init:
  FROM +build-docusaurus
  RUN yarn add /graphql-markdown/docusaurus2-graphql-doc-generator.tgz
  RUN yarn add @graphql-tools/url-loader
  COPY ./tests/e2e/docusaurus2-graphql-doc-generator.config.js ./docusaurus2-graphql-doc-generator.config.js
  COPY ./tests/e2e/docusaurus2-graphql-doc-generator-groups.config.js ./docusaurus2-graphql-doc-generator-groups.config.js
  COPY ./scripts/config-plugin.js ./config-plugin.js
  COPY ./tests/__data__ ./data
  COPY ./docs/img ./static/img
  COPY ./README.md ./docs/README.md
  RUN node config-plugin.js

smoke-test:
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN yarn global add fs-extra jest
  COPY ./tests/e2e/specs ./__tests__/e2e/specs
  COPY ./tests/helpers ./__tests__/helpers
  COPY ./tests/e2e/jest.config.js ./jest.config.js
  ENV NODE_ENV=ci
  RUN node --expose-gc /usr/local/bin/jest --logHeapUsage --runInBand
  ENTRYPOINT ["npx", "docusaurus", "graphql-to-doc"]

smoke-run:
  ARG OPTIONS=
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npx docusaurus graphql-to-doc $OPTIONS
  RUN yarn build

build-demo:
  ARG flag
  ARG port=8080
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npx docusaurus graphql-to-doc --homepage data/anilist.md --schema https://graphql.anilist.co/ --force
  RUN npx docusaurus graphql-to-doc --homepage data/groups.md --schema data/schema_with_grouping.graphql --groupByDirective "@doc(category|=Common)" --base "group-by" --force
  RUN yarn build
  EXPOSE $port
  ENTRYPOINT ["yarn", "serve", "--host=0.0.0.0", "--port=$port"]
  SAVE ARTIFACT --force ./build AS LOCAL docs
  SAVE IMAGE graphql-markdown:demo

publish:
  FROM +all
  GIT CLONE --branch main https://github.com/edno/graphql-markdown.git /graphql-markdown
  WORKDIR /graphql-markdown
  RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
  RUN --secret NPM_TOKEN=+secrets/token npm publish

all:
  BUILD +build-package
  BUILD +lint
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-test
