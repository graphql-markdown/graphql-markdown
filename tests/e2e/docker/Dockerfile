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
WORKDIR docusaurus2
RUN yarn add /usr/src/app/docusaurus2-graphql-doc-generator
RUN node /usr/src/app/docusaurus2-graphql-doc-generator/tests/e2e/scripts/config-plugin.js

FROM docusaurus2-graphql-doc-generator as tests-e2e
ENV TESTS_FOLDER=__tests__
WORKDIR /usr/src/app/docusaurus2
RUN mkdir $TESTS_FOLDER
COPY ./tests/e2e/specs $TESTS_FOLDER
COPY ./tests/e2e/jest.config.js .
COPY ./tests/e2e/docusaurus2-graphql-doc-generator.config.json .
# RUN npx docusaurus graphql-to-doc
# RUN cp docs/sidebar-schema.js ./sidebars.js
# CMD yarn run start -- --host 0.0.0.0 --port 8080
CMD jest --ci
