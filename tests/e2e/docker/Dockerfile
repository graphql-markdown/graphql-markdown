FROM node:current-alpine as node-jest
RUN npm install --global --no-progress --loglevel=error jest

FROM node-jest as docusaurus2
WORKDIR /usr/src/app
RUN npx --quiet @docusaurus/init@next init docusaurus2 classic
EXPOSE 8080

FROM docusaurus2 as docusaurus2-graphql-doc-generator
WORKDIR /usr/src/app
RUN mkdir docusaurus2-graphql-doc-generator
ADD . docusaurus2-graphql-doc-generator
WORKDIR /usr/src/app/docusaurus2-graphql-doc-generator
RUN yarn link
WORKDIR /usr/src/app/docusaurus2
RUN yarn link @edno/docusaurus2-graphql-doc-generator
RUN node /usr/src/app/docusaurus2-graphql-doc-generator/tests/e2e/scripts/config-plugin.js

FROM docusaurus2-graphql-doc-generator as tests-e2e
WORKDIR /usr/src/app/docusaurus2/__tests__
