VERSION 0.8

ARG nodeVersion="lts"
ARG npmVersion="latest"
ARG --global docusaurusVersion="latest"
ARG --global docusaurusProject="docusaurus-gqlmd"
ARG --global gqlmdCliProject="cli-gqlmd"
ARG --global testTimeout="5000"
ARG --global coverage="true"

FROM docker.io/library/node:$nodeVersion-alpine
WORKDIR /graphql-markdown
ENV NODE_ENV=ci
ENV HUSKY=0
ENV NODE_OPTIONS=--dns-result-order=ipv4first
RUN --mount=type=cache,target=/root/.bun npm install --global npm@$npmVersion bun
RUN node --version
RUN npm --version
RUN bun --version

deps:
    COPY . .
    COPY --dir config ./config
    COPY --dir scripts ./scripts
    COPY --dir packages/*/package*.json ./packages/
    RUN --mount=type=cache,target=/root/.bun bun ci --silent
    # Cache node_modules
    SAVE ARTIFACT node_modules AS LOCAL node_modules

lint: 
  FROM +deps
    RUN bun run ts:check
    RUN bun run prettier
    RUN bun run lint

build:
  FROM +lint
    RUN bun run clean:all
    RUN bun run build:all

unit-test:
  FROM +build
  RUN bun install --silent --global jest
  RUN bun run test:ci /unit

integration-test:
  FROM +build
  RUN bun install --silent --global jest
  RUN bun run test:ci /integration

mutation-test:
  FROM +build
  RUN bun run stryker
  IF [ ! $(EARTHLY_CI) ]
    SAVE ARTIFACT reports AS LOCAL ./reports
  END

build-package:
  FROM +build
  ARG --required package
  WORKDIR /graphql-markdown/packages/$package
  RUN bun run build
  RUN bun pm pack --quiet --filename /graphql-markdown/graphql-markdown-$package.tgz
  WORKDIR /graphql-markdown
  SAVE ARTIFACT graphql-markdown-$package.tgz

build-docusaurus-project:
  FROM +build
  WORKDIR /
  IF [ "$docusaurusVersion" = "2" ]
    RUN npx --quiet --legacy-peer-deps create-docusaurus@$docusaurusVersion "$docusaurusProject" classic --skip-install
  ELSE
    RUN npx --quiet --legacy-peer-deps create-docusaurus@$docusaurusVersion "$docusaurusProject" classic --skip-install --javascript 
  END
  WORKDIR /$docusaurusProject
  RUN rm -rf docs; rm -rf blog; rm -rf src; rm -rf static/img
  DO +INSTALL_DOCUSAURUS

setup-cli-project:
  FROM +build
  RUN mkdir /$gqlmdCliProject
  WORKDIR /$gqlmdCliProject
  DO +INSTALL_GRAPHQL
  DO +INSTALL_GQLMD
  RUN npm add ./graphql-markdown-cli.tgz
  COPY --dir ./packages/cli/tests/__data__ ./data

setup-docusaurus-project:
  FROM +build-docusaurus-project
  WORKDIR /$docusaurusProject
  DO +INSTALL_GRAPHQL
  DO +INSTALL_GQLMD
  RUN npm add ./graphql-markdown-cli.tgz
  RUN npm add ./graphql-markdown-docusaurus.tgz
  COPY --dir ./packages/docusaurus/tests/__data__ ./data
  COPY --dir ./website/static/img ./static/img
  COPY --dir ./website/src/css ./src/css
  RUN mv ./data/.graphqlrc ./.graphqlrc
  RUN mv ./data/docusaurus2-graphql-doc-build.js ./docusaurus2-graphql-doc-build.js
  RUN mv ./data/docusaurus2-graphql-doc-nobuild.js ./docusaurus2-graphql-doc-nobuild.js
  RUN mv ./data/scripts/config-plugin.js ./config-plugin.js
  RUN npm add ./data/e2e-test-webpack-plugin # Custom plugin for silencing webpack warnings [webpack.cache.PackFileCacheStrategy] 
  RUN node config-plugin.js

smoke-docusaurus-test:
  FROM +setup-docusaurus-project
  WORKDIR /$docusaurusProject
  RUN npm install --silent --global jest
  RUN npm add graphql-config
  COPY --dir ./packages/docusaurus/tests/e2e ./__tests__/e2e
  COPY --dir ./packages/docusaurus/tests/helpers ./__tests__/helpers
  RUN mv ./__tests__/e2e/jest.config.js ./jest.config.js
  RUN npx jest --runInBand

smoke-cli-test:
  FROM +setup-cli-project
  WORKDIR /$gqlmdCliProject
  RUN npm install --silent --global jest
  COPY --dir ./packages/cli/tests/e2e ./__tests__/e2e
  COPY --dir ./packages/cli/tests/helpers ./__tests__/helpers
  RUN mv ./__tests__/e2e/jest.config.js ./jest.config.js
  RUN mv ./data/cli-graphql-doc-generator-multi-instance.config.js ./graphql.config.js
  RUN npx jest --runInBand

smoke-docusaurus-run:
  ARG options=
  FROM +setup-docusaurus-project
  WORKDIR /$docusaurusProject
  DO +GQLMD --options=$options
  RUN npm run build
  RUN npm run clear

build-docusaurus-examples:
  LET folderDocs="examples"
  FROM +setup-docusaurus-project
  WORKDIR /$docusaurusProject
  RUN npm add prettier
  RUN mkdir $folderDocs
  LET folderExample="default"
  LET idExample="default"
  DO +GQLMD --options="--homepage data/anilist.md --schema https://graphql.anilist.co/ --base . --link /${folderDocs}/${folderExample} --force --pretty --deprecated group"
  RUN mv docs ./$folderDocs/$folderExample
  SET folderExample="group-by"
  SET idExample="schema_with_grouping"
  DO +GQLMD --id="${idExample}" --options="--homepage data/groups.md --schema data/${idExample}.graphql --groupByDirective @doc(category|=Common) --base . --link /${folderDocs}/${folderExample} --skip @noDoc --index --noParentType --noRelatedType --deprecated group --hierarchy entity"
  RUN mv docs ./$folderDocs/$folderExample
  SAVE ARTIFACT ./$folderDocs

build-cli-examples:
  LET folderDocs="examples"
  FROM +setup-cli-project
  WORKDIR /$gqlmdCliProject
  RUN npm add prettier
  RUN mv ./data/graphql.config.js ./graphql.config.js
  RUN mkdir $folderDocs
  LET folderExample="default"
  LET idExample="default"
  LET command="gqlmd"
  DO +GQLMD --command=$command --options="--homepage data/anilist.md --schema https://graphql.anilist.co/ --base . --link /${folderDocs}/${folderExample} --force --pretty --deprecated group"
  RUN mv docs ./$folderDocs/$folderExample
  SET folderExample="group-by"
  SET idExample="schema_with_grouping"
  DO +GQLMD --command=$command --id="${idExample}" --options="--homepage data/groups.md --schema data/${idExample}.graphql --groupByDirective @doc(category|=Common) --base . --link /${folderDocs}/${folderExample} --skip @noDoc --index --noParentType --noRelatedType --deprecated group --hierarchy entity"
  RUN mv docs ./$folderDocs/$folderExample
  SAVE ARTIFACT ./$folderDocs

build-api-docs:
  FROM +build
  COPY ./docs/__api/__index.md /graphql-markdown/docs/__api/__index.md
  RUN npm run docs:api
  SAVE ARTIFACT ./api

build-docs:
  COPY ./website ./
  COPY (+build-docusaurus-examples/examples) ./examples
  COPY (+build-api-docs/api) ./api
  COPY --dir docs .
  RUN npm install --legacy-peer-deps
  RUN npx update-browserslist-db@latest
  RUN DOCUSAURUS_IGNORE_SSG_WARNINGS=true npm run build
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
  BUILD +smoke-docusaurus-test

# --- UDCs ---

GQLMD:
  FUNCTION
  ARG id
  ARG options
  ARG command=docusaurus
  RUN mkdir -p docs
  IF [ ! $id ]
    RUN bunx $command graphql-to-doc $options 2>&1 | tee ./run.log
  ELSE
    RUN bunx $command graphql-to-doc:${id} $options 2>&1 | tee ./run.log
  END
  RUN test `grep -c -i "An error occurred" run.log` -eq 0 && echo "Success" || (echo "Failed with errors"; exit 1) 

INSTALL_GQLMD:
  FUNCTION
  FOR package IN $(node /graphql-markdown/scripts/build-packages.js)
    COPY (+build-package/graphql-markdown-${package}.tgz --package=${package}) ./
    IF [ "$package" != "cli" ] && [ "$package" != "docusaurus" ]
      RUN npm add ./graphql-markdown-${package}.tgz
    END
  END

INSTALL_DOCUSAURUS:
  FUNCTION
  RUN npm install --legacy-peer-deps
  RUN npm update @docusaurus/core @docusaurus/preset-classic

INSTALL_GRAPHQL:
  FUNCTION
  RUN npm add graphql @graphql-tools/url-loader @graphql-tools/graphql-file-loader
