FROM node:current-alpine AS node-jest
RUN npm install --global --no-progress --loglevel=error --no-fund --no-audit jest fs-extra

FROM node-jest AS docusaurus2
WORKDIR /usr/src/app
RUN npx --quiet @docusaurus/init@latest init docusaurus2 classic
EXPOSE 8080

FROM docusaurus2 AS docusaurus2-graphql-doc-generator
WORKDIR /usr/src/app
RUN mkdir docusaurus2-graphql-doc-generator
ADD . docusaurus2-graphql-doc-generator
WORKDIR /usr/src/app/docusaurus2-graphql-doc-generator
RUN yarn pack --filename docusaurus2-graphql-doc-generator.tgz
WORKDIR /usr/src/app/docusaurus2
RUN yarn add /usr/src/app/docusaurus2-graphql-doc-generator/docusaurus2-graphql-doc-generator.tgz
RUN node /usr/src/app/docusaurus2-graphql-doc-generator/tests/e2e/scripts/config-plugin.js

FROM docusaurus2-graphql-doc-generator AS tests-e2e
WORKDIR /usr/src/app/docusaurus2/__tests__
