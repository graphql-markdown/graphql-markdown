FROM node:lts-alpine
WORKDIR /graphql-markdown

deps:
    COPY . .
    RUN yarn install --frozen-lockfile

build:
  FROM +deps
  RUN yarn pack --filename docusaurus2-graphql-doc-generator.tgz

lint: 
  FROM +build
  RUN prettier "**/*.{js,json,md}"
  RUN yarn eslint "**/*.js"

lint-fix: 
  FROM +build
  RUN prettier --write "**/*.{js,json,md}"
  RUN yarn eslint "**/*.js" --fix
  SAVE ARTIFACT src AS LOCAL ./src

unit-test:
  FROM +deps
  RUN yarn jest --projects tests/unit

integration-test:
  FROM +deps
  RUN yarn jest --projects tests/integration

smoke-init:
  FROM +build
  WORKDIR /
  RUN npx --quiet @docusaurus/init@latest init docusaurus2 classic
  WORKDIR /docusaurus2
  RUN yarn set version latest
  RUN yarn add /graphql-markdown/docusaurus2-graphql-doc-generator.tgz
  COPY ./tests/e2e/docusaurus2-graphql-doc-generator.config.json ./docusaurus2-graphql-doc-generator.config.json
  COPY ./tests/e2e/scripts ./scripts
  COPY ./tests/__data__ ./data
  RUN node ./scripts/config-plugin.js

smoke-test-deps:
  FROM +smoke-init
  RUN yarn global add fs-extra jest
  WORKDIR /docusaurus2
  RUN yarn install
  COPY ./tests/e2e/specs ./__tests__
  COPY ./tests/e2e/jest.config.js ./jest.config.js

smoke-test:
  FROM +smoke-test-deps
  WORKDIR /docusaurus2
  RUN jest

docker:
  FROM +smoke-init
  WORKDIR /docusaurus2/scripts
  RUN sh build.sh
  EXPOSE 8080
  ENTRYPOINT ["sh", "start.sh"]
  SAVE IMAGE graphql-markdown:demo

all:
  BUILD +build
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-test
  BUILD +docker