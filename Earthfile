FROM node:lts-alpine
WORKDIR /graphql-markdown

deps:
    COPY . .
    RUN yarn install --frozen-lockfile

build:
  FROM +deps
  RUN yarn pack --filename docusaurus2-graphql-doc-generator.tgz

lint: 
  ARG flag
  FROM +build
  IF [ "$flag" = "fix" ]
    RUN yarn prettier --write "**/*.{js,json,md}"
    RUN yarn eslint "**/*.js" --fix
    SAVE ARTIFACT src AS LOCAL ./src
  ELSE
    RUN yarn prettier "**/*.{js,json,md}"
    RUN yarn eslint "**/*.js"
  END

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

image:
  ARG port=8080
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npx docusaurus graphql-to-doc
  RUN yarn build --no-minify
  EXPOSE $port
  ENTRYPOINT ["yarn", "serve", "--host=0.0.0.0", "--port=$port"]
  SAVE IMAGE graphql-markdown:demo

all:
  BUILD +build
  BUILD +lint
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-test
  BUILD +image
