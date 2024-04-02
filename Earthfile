VERSION 0.8

ARG nodeVersion="lts"
ARG docusaurusVersion="latest"
ARG docusaurusProject="docusaurus2"

FROM docker.io/library/node:$nodeVersion-alpine
RUN npm install -g npm@latest
WORKDIR /graphql-markdown

deps:
  COPY package.json package-lock.json tsconfig.json tsconfig.base.json ./
  COPY --dir config packages ./
  RUN npm config set update-notifier false
  RUN npm ci

lint: 
  FROM +deps
  RUN export NODE_ENV=ci
  RUN npm run ts:check
  RUN npm run prettier -- --check
  RUN npm run lint

build:
  FROM +lint
  RUN npm run build

unit-test:
  FROM +build
  RUN export NODE_ENV=ci
  RUN npm run test:ci /unit

integration-test:
  FROM +build
  RUN export NODE_ENV=ci
  RUN npm run test:ci /integration

mutation-test:
  FROM +deps
  RUN npm run stryker --workspaces --if-present -- --reporters progress,html
  IF [ ! $(EARTHLY_CI) ]
    SAVE ARTIFACT reports AS LOCAL ./reports
  END

build-package:
  FROM +build
  ARG --required package
  RUN npm pack --workspace @graphql-markdown/$package | tail -n 1 | xargs -t -I{} mv {} graphql-markdown-$package.tgz
  SAVE ARTIFACT graphql-markdown-$package.tgz

build-docusaurus:
  WORKDIR /
  DO +CREATE --version=$docusaurusVersion --project=$docusaurusProject

smoke-init:
  FROM +build-docusaurus
  WORKDIR /$docusaurusProject
  RUN npm install graphql @graphql-tools/url-loader @graphql-tools/graphql-file-loader
  FOR package IN types utils graphql helpers logger printer-legacy diff core docusaurus
    COPY (+build-package/graphql-markdown-${package}.tgz --package=${package}) ./
    RUN npm install ./graphql-markdown-${package}.tgz
  END
  COPY ./packages/docusaurus/scripts/config-plugin.js ./config-plugin.js
  COPY ./website/src/css/custom.css ./src/css/custom.css
  COPY --dir ./packages/docusaurus/tests/__data__ ./data
  COPY ./packages/docusaurus/tests/__data__/.graphqlrc ./.graphqlrc
  COPY ./packages/docusaurus/tests/__data__/docusaurus2-graphql-doc-build.js ./docusaurus2-graphql-doc-build.js
  COPY ./packages/docusaurus/tests/__data__/docusaurus2-graphql-doc-nobuild.js ./docusaurus2-graphql-doc-nobuild.js
  COPY ./website/static/img ./static/img
  RUN node config-plugin.js

smoke-test:
  FROM +smoke-init
  WORKDIR /$docusaurusProject
  RUN npm config set update-notifier false
  RUN npm install -g jest 
  RUN npm install graphql-config
  COPY --dir ./packages/docusaurus/tests/e2e/specs ./__tests__/e2e/specs
  COPY --dir ./packages/docusaurus/tests/helpers ./__tests__/helpers
  COPY ./packages/docusaurus/tests/e2e/jest.config.js ./jest.config.js
  RUN export NODE_ENV=ci
  RUN npx jest --runInBand

smoke-run:
  ARG OPTIONS=
  FROM +smoke-init
  WORKDIR /$docusaurusProject
  DO +GQLMD --options=$OPTIONS
  RUN npm run build
  RUN npm run clear

build-examples:
  ARG VERSION=latest
  ARG TARGET=examples
  FROM +smoke-init
  WORKDIR /$docusaurusProject
  RUN npm install prettier
  RUN mkdir $TARGET
  DO +GQLMD --options="--homepage data/anilist.md --schema https://graphql.anilist.co/ --base . --link /${TARGET}/default --force --pretty --deprecated group"
  RUN mv docs ./$TARGET/default
  DO +GQLMD --id="schema_with_grouping" --options="--homepage data/groups.md --schema data/schema_with_grouping.graphql --groupByDirective @doc(category|=Common) --base . --link /${TARGET}/group-by --skip @noDoc --index --noParentType --noRelatedType --deprecated group --noApiGroup"
  RUN mv docs ./$TARGET/group-by
  SAVE ARTIFACT ./$TARGET

build-docs:
  COPY ./website ./
  COPY (+build-examples/examples) ./examples
  COPY --dir docs .
  COPY --dir api .
  RUN npm install
  RUN npx update-browserslist-db@latest
  RUN npm run build
  SAVE ARTIFACT --force ./build AS LOCAL build

build-image:
  FROM +build-docs
  EXPOSE 8080
  ENTRYPOINT ["npm", "run", "serve", "--",  "--host=0.0.0.0", "--port=8080"]
  SAVE IMAGE graphql-markdown:docs

all:
  BUILD +lint
  BUILD +build
  BUILD +unit-test
  BUILD +integration-test
  BUILD +smoke-test

# --- UDCs ---

GQLMD:
  FUNCTION
  ARG id
  ARG options
  RUN mkdir -p docs
  IF [ ! $id ]
    RUN npx docusaurus graphql-to-doc $options 2>&1 | tee ./run.log
  ELSE
    RUN npx docusaurus graphql-to-doc:${id} $options 2>&1 | tee ./run.log
  END
  RUN test `grep -c -i "An error occurred" run.log` -eq 0 && echo "Success" || (echo "Failed with errors"; exit 1) 

CREATE:
  FUNCTION
  ARG version="latest"
  ARG project="docusaurus2"
  IF [ "$version" == "2" ]
    RUN npx create-docusaurus@$version $project classic --skip-install --package-manager npm
  ELSE
    RUN npx create-docusaurus@$version $project classic --javascript --skip-install --package-manager npm
  END
  WORKDIR /$project
  RUN rm -rf docs; rm -rf blog; rm -rf src; rm -rf static/img
  RUN npm install
  RUN npm upgrade @docusaurus/core @docusaurus/preset-classic
