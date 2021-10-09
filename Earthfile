ARG nodeVersion=lts
FROM node:$nodeVersion-alpine
WORKDIR /graphql-markdown
ENV NPM_TOKEN=""

deps:
    COPY . .
    RUN yarn install --frozen-lockfile

build:
  FROM +deps
  RUN yarn pack --filename docusaurus2-graphql-doc-generator.tgz

lint: 
  ARG flag
  FROM +deps
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    RUN yarn prettier --write
    RUN yarn lint --fix
    SAVE ARTIFACT --if-exists ./ AS LOCAL ./
  ELSE
    RUN yarn prettier --check
    RUN yarn lint
  END

unit-test:
  ARG flag
  FROM +deps
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    RUN yarn jest --projects tests/unit -u
    SAVE ARTIFACT --if-exists tests/unit AS LOCAL ./tests/unit
  ELSE
    RUN yarn jest --projects tests/unit
  END

integration-test:
  ARG flag
  FROM +deps
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    RUN yarn jest --projects tests/integration -u
    SAVE ARTIFACT --if-exists tests/integration AS LOCAL ./tests/integration
  ELSE
    RUN yarn jest --projects tests/integration
  END

mutation-test:
  FROM +deps
  RUN yarn stryker run --logLevel error --inPlace
  SAVE ARTIFACT reports AS LOCAL ./reports

smoke-init:
  FROM +build
  WORKDIR /
  RUN npx --quiet @docusaurus/init@latest init docusaurus2 classic
  WORKDIR /docusaurus2
  RUN rm -rf docs; rm -rf blog; rm -rf src; rm -rf static/img
  RUN yarn install
  RUN yarn add /graphql-markdown/docusaurus2-graphql-doc-generator.tgz
  RUN yarn add @graphql-tools/url-loader
  COPY ./tests/e2e/docusaurus2-graphql-doc-generator.config.js ./docusaurus2-graphql-doc-generator.config.js
  COPY ./scripts/config-plugin.js ./config-plugin.js
  COPY ./tests/__data__ ./data
  COPY ./docs/img ./static/img
  COPY ./README.md ./docs/README.md
  RUN node config-plugin.js

smoke-test:
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN yarn global add fs-extra jest
  COPY ./tests/e2e/specs ./__tests__
  COPY ./tests/e2e/jest.config.js ./jest.config.js
  RUN jest

build-demo:
  ARG flag
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npx docusaurus graphql-to-doc
  RUN yarn build
  IF [ "$flag" != 'ignore' ] && [ ! $EARTHLY_CI ]
    SAVE ARTIFACT --force ./build AS LOCAL docs
  END

image-demo:
  ARG port=8080
  FROM +build-demo
  WORKDIR /docusaurus2
  EXPOSE $port
  ENTRYPOINT ["yarn", "serve", "--host=0.0.0.0", "--port=$port"]
  SAVE IMAGE graphql-markdown:demo

publish:
  FROM +all
  GIT CLONE --branch main https://github.com/edno/graphql-markdown.git /graphql-markdown
  WORKDIR /graphql-markdown
  RUN --secret NPM_TOKEN=+secrets/token npm publish

all:
  BUILD +build
  BUILD +lint
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-test
