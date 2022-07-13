VERSION 0.6

ARG nodeVersion=lts
FROM docker.io/library/node:$nodeVersion-alpine
RUN npm install -g npm@latest
WORKDIR /graphql-markdown

deps:
  COPY . .
  RUN npm config set update-notifier false
  RUN yarn install --frozen-lockfile --silent

lint: 
  ARG flag
  FROM +deps
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    RUN yarn prettier --write
    RUN yarn lint --fix
  ELSE
    RUN export NODE_ENV=ci
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
    RUN export NODE_ENV=ci
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/unit
  END

integration-test:
  ARG flag
  FROM +deps
  IF [ "$flag" = 'update' ] && [ ! $(EARTHLY_CI) ]
    RUN node --expose-gc ./node_modules/.bin/jest --logHeapUsage --runInBand --projects tests/integration -u
    SAVE ARTIFACT --if-exists tests/integration AS LOCAL ./tests/integration
  ELSE
    RUN export NODE_ENV=ci
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
  SAVE ARTIFACT docusaurus2-graphql-doc-generator.tgz

build-docusaurus:
  WORKDIR /
  RUN npx --quiet @docusaurus/init@latest init docusaurus2 classic
  WORKDIR /docusaurus2
  RUN rm -rf docs; rm -rf blog; rm -rf src; rm -rf static/img
  RUN yarn install --silent
  RUN yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest

smoke-init:
  FROM +build-docusaurus
  RUN yarn add graphql @graphql-tools/url-loader
  COPY +build-package/docusaurus2-graphql-doc-generator.tgz ./
  RUN yarn add ./docusaurus2-graphql-doc-generator.tgz
  COPY ./scripts/config-plugin.js ./config-plugin.js
  COPY ./.docs/custom.css ./src/css/custom.css
  COPY --dir ./tests/__data__ ./data
  COPY ./*.svg ./*.png ./*.ico ./static/img/
  COPY ./README.md ./docs/README.md
  RUN touch ./docs/.nojekyll
  RUN node config-plugin.js

smoke-test:
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npm config set update-notifier false
  RUN yarn global add fs-extra jest
  COPY --dir ./tests/e2e/specs ./__tests__/e2e/specs
  COPY --dir ./tests/helpers ./__tests__/helpers
  COPY ./tests/e2e/jest.config.js ./jest.config.js
  RUN export NODE_ENV=ci
  RUN node --expose-gc /usr/local/bin/jest --logHeapUsage --runInBand

smoke-run:
  ARG OPTIONS=
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN npx docusaurus graphql-to-doc $OPTIONS
  RUN yarn build

build-docs:
  FROM +smoke-init
  WORKDIR /docusaurus2
  RUN yarn add prettier
  RUN npx docusaurus graphql-to-doc --homepage data/anilist.md --schema https://graphql.anilist.co/ --force --pretty --noPagination --noToc --index 
  RUN npx docusaurus graphql-to-doc --homepage data/groups.md --schema data/schema_with_grouping.graphql --groupByDirective "@doc(category|=Common)" --base "group-by" --force
  RUN yarn build
  SAVE ARTIFACT --force ./build AS LOCAL docs

build-image:
  FROM +build-docs
  EXPOSE 8080
  ENTRYPOINT ["yarn", "serve", "--host=0.0.0.0", "--port=8080"]
  SAVE IMAGE graphql-markdown:docs

all:
  BUILD +build-package
  BUILD +lint
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-test
