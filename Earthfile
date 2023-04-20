VERSION 0.6

ARG nodeVersion=lts
FROM docker.io/library/node:$nodeVersion-alpine
RUN npm install -g npm@latest
WORKDIR /graphql-markdown

deps:
  COPY package.json package-lock.json ./
  COPY --dir config packages ./
  RUN npm config set update-notifier false
  RUN npm ci

lint: 
  FROM +deps
  IF [ ! $(EARTHLY_CI) ]
    RUN npm run prettier -- --write
    RUN npm run lint -- --fix
  ELSE
    RUN export NODE_ENV=ci
    RUN npm run prettier -- --check
    RUN npm run lint
  END

unit-test:
  FROM +deps
  RUN export NODE_ENV=ci
  RUN npm test --workspaces --if-present -- --passWithNoTests --runInBand --selectProjects unit

integration-test:
  FROM +deps
  RUN export NODE_ENV=ci
  RUN npm run test --workspaces --if-present -- --passWithNoTests --runInBand --selectProjects integration

mutation-test:
  FROM +deps
  RUN npm run stryker --workspaces --if-present -- --reporters progress,html
  IF [ ! $(EARTHLY_CI) ]
    SAVE ARTIFACT reports AS LOCAL ./reports
  END

build-package:
  FROM +deps
  ARG --required package
  RUN npm pack -w @graphql-markdown/$package | tail -n 1 | xargs -t -I{} mv {} graphql-markdown-$package.tgz
  SAVE ARTIFACT graphql-markdown-$package.tgz

build-docusaurus:
  WORKDIR /
  RUN npx --quiet create-docusaurus@latest docusaurus2 classic
  WORKDIR /docusaurus2
  RUN rm -rf docs; rm -rf blog; rm -rf src; rm -rf static/img
  RUN npm cache clean --force; rm -rf node_modules
  RUN npm ci
  RUN npm upgrade @docusaurus/core @docusaurus/preset-classic

smoke-init:
  FROM +build-docusaurus
  WORKDIR /docusaurus2
  RUN npm install graphql @graphql-tools/url-loader @graphql-tools/graphql-file-loader
  FOR package IN utils printer-legacy diff core docusaurus
    COPY (+build-package/graphql-markdown-${package}.tgz --package=${package}) ./
    RUN npm install ./graphql-markdown-${package}.tgz
  END
  COPY ./packages/docusaurus/scripts/config-plugin.js ./config-plugin.js
  COPY ./website/src/css/custom.css ./src/css/custom.css
  COPY --dir ./packages/docusaurus/tests/__data__ ./data
  COPY ./website/static/img ./static/img
  RUN node config-plugin.js

smoke-test:
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npm config set update-notifier false
  RUN npm install -g fs-extra jest
  COPY --dir ./packages/docusaurus/tests/e2e/specs ./__tests__/e2e/specs
  COPY --dir ./packages/docusaurus/tests/helpers ./__tests__/helpers
  COPY ./packages/docusaurus/tests/e2e/jest.config.js ./jest.config.js
  RUN export NODE_ENV=ci
  RUN npx jest --runInBand

smoke-run:
  ARG OPTIONS=
  FROM +smoke-init
  WORKDIR /docusaurus2
  DO +GQLMD --options=$OPTIONS
  RUN npm run build
  RUN npm run clear

build-examples:
  ARG TARGET=examples
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npm install prettier
  RUN mkdir $TARGET
  DO +GQLMD --options="--homepage data/anilist.md --schema https://graphql.anilist.co/ --base . --link /${TARGET}/default --force --pretty --noPagination --deprecated group"
  RUN mv docs ./$TARGET/default
  DO +GQLMD --options="--homepage data/groups.md --schema data/schema_with_grouping.graphql --groupByDirective @doc(category|=Common) --base . --link /${TARGET}/group-by --skip @noDoc --index --noTypeBadges --noParentType --noRelatedType --deprecated group"
  RUN mv docs ./$TARGET/group-by
  SAVE ARTIFACT ./$TARGET

build-docs:
  COPY ./website ./
  COPY +build-examples/examples ./examples
  COPY --dir docs .
  RUN npm install
  RUN npm run build
  SAVE ARTIFACT --force ./build AS LOCAL build

build-image:
  FROM +build-docs
  EXPOSE 8080
  ENTRYPOINT ["npm", "run", "serve", "--",  "--host=0.0.0.0", "--port=8080"]
  SAVE IMAGE graphql-markdown:docs

all:
  BUILD +lint
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-test

# --- UDCs ---

GQLMD:
  COMMAND
  ARG options
  RUN mkdir -p docs
  RUN npx docusaurus graphql-to-doc $options 2>&1 | tee ./run.log
  RUN test `grep -c -i "An error occurred" run.log` -eq 0 && echo "Success" || (echo "Failed with errors"; exit 1) 
