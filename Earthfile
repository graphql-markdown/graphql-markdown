FROM node:lts-alpine
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
  IF [ "$flag" = "update" ]
    RUN yarn prettier --write "**/*.{js,json,md}"
    RUN yarn eslint "**/*.js" --fix
    SAVE ARTIFACT --if-exists ./ AS LOCAL ./
  ELSE
    RUN yarn prettier --check "**/*.{js,json,md}"
    RUN yarn eslint "**/*.js"
  END

unit-test:
  ARG flag
  FROM +deps
  IF [ "$flag" = "update" ]
    RUN yarn jest --projects tests/unit -u
    SAVE ARTIFACT --if-exists tests/unit AS LOCAL ./tests/unit
  ELSE
    RUN yarn jest --projects tests/unit
  END

integration-test:
  ARG flag
  FROM +deps
  IF [ "$flag" = "update" ]
    RUN yarn jest --projects tests/integration -u
    SAVE ARTIFACT --if-exists tests/integration AS LOCAL ./tests/integration
  ELSE
    RUN yarn jest --projects tests/integration
  END

smoke-init:
  FROM +build
  WORKDIR /
  RUN npx --quiet @docusaurus/init@latest init docusaurus2 classic
  WORKDIR /docusaurus2
  RUN yarn set version latest
  RUN yarn add /graphql-markdown/docusaurus2-graphql-doc-generator.tgz
  COPY ./tests/e2e/docusaurus2-graphql-doc-generator.config.json ./docusaurus2-graphql-doc-generator.config.json
  COPY ./scripts/config-plugin.js ./config-plugin.js
  COPY ./tests/__data__ ./data
  COPY ./graphql-markdown.svg ./static/img/graphql-markdown.svg
  COPY ./README.md ./docs/README.md
  RUN node config-plugin.js

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
