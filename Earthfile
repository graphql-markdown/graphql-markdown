VERSION 0.6

ARG nodeVersion=lts
FROM docker.io/library/node:$nodeVersion-alpine
RUN npm install -g npm@latest
WORKDIR /graphql-markdown

deps:
  COPY . .
  RUN npm config set update-notifier false
  RUN npm ci

lint: 
  ARG flag
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
  ARG flag
  FROM +deps
  IF [ ! $(EARTHLY_CI) ]
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/unit -u
    SAVE ARTIFACT --if-exists tests/unit AS LOCAL ./tests/unit
  ELSE
    RUN export NODE_ENV=ci
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/unit
  END

integration-test:
  ARG flag
  FROM +deps
  IF [ ! $(EARTHLY_CI) ]
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/integration -u
    SAVE ARTIFACT --if-exists tests/integration AS LOCAL ./tests/integration
  ELSE
    RUN export NODE_ENV=ci
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/integration
  END

mutation-test:
  FROM +deps
  RUN npm run stryker -- run --reporters progress,html
  IF [ ! $(EARTHLY_CI) ]
    SAVE ARTIFACT reports AS LOCAL ./reports
  END

build-package:
  FROM +deps
  RUN npm pack | tail -n 1 | xargs -t -I{} mv {} docusaurus-plugin.tgz
  SAVE ARTIFACT docusaurus-plugin.tgz

build-docusaurus:
  WORKDIR /
  RUN npx --quiet create-docusaurus@latest docusaurus2 classic
  WORKDIR /docusaurus2
  RUN rm -rf docs; rm -rf blog; rm -rf src; rm -rf static/img
  RUN npm ci
  RUN npm upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest

smoke-init:
  FROM +build-docusaurus
  RUN npm install graphql @graphql-tools/url-loader
  COPY +build-package/docusaurus-plugin.tgz ./
  RUN npm install ./docusaurus-plugin.tgz
  COPY ./scripts/config-plugin.js ./config-plugin.js
  COPY ./website/src/css/custom.css ./src/css/custom.css
  COPY --dir ./tests/__data__ ./data
  COPY ./website/static/img ./static/img
  RUN node config-plugin.js

smoke-test:
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npm config set update-notifier false
  RUN npm install -g fs-extra jest
  COPY --dir ./tests/e2e/specs ./__tests__/e2e/specs
  COPY --dir ./tests/helpers ./__tests__/helpers
  COPY ./tests/e2e/jest.config.js ./jest.config.js
  RUN export NODE_ENV=ci
  RUN node --expose-gc /usr/local/bin/jest --logHeapUsage --runInBand

smoke-run:
  ARG OPTIONS=
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN mkdir docs
  RUN npx docusaurus graphql-to-doc $OPTIONS
  RUN npm run build
  RUN npm run clear

build-examples:
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npm install prettier
  RUN mkdir examples
  RUN mkdir docs
  RUN npx docusaurus graphql-to-doc --homepage data/anilist.md --schema https://graphql.anilist.co/  --link "/schema" --force --pretty --noPagination --noToc
  RUN npm run build
  RUN npm run clear
  RUN mv docs ./examples/schema
  RUN mkdir docs
  RUN npx docusaurus graphql-to-doc --homepage data/groups.md --schema data/schema_with_grouping.graphql --groupByDirective "@doc(category|=Common)"  --link "/group-by" --index --noTypeBadges --noParentType --noRelatedType --force
  RUN npm run build
  RUN npm run clear
  RUN mv docs ./examples/group-by
  SAVE ARTIFACT ./examples

build-docs:
  COPY ./website ./
  COPY --dir docs ./docs
  COPY +build-examples/examples ./examples
  COPY +build-package/docusaurus-plugin.tgz .
  RUN npm install
  RUN npm install ./docusaurus-plugin.tgz
  RUN npm run build
  SAVE ARTIFACT --force ./build AS LOCAL build

build-image:
  FROM +build-docs
  EXPOSE 8080
  ENTRYPOINT ["npm", "run", "serve", "--",  "--host=0.0.0.0", "--port=8080"]
  SAVE IMAGE graphql-markdown:docs

all:
  BUILD +build-package
  BUILD +lint
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-test
