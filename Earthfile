VERSION 0.8

ARG nodeVersion="lts"
ARG npmVersion="latest"
ARG --global docusaurusVersion="latest"
ARG --global docusaurusProject="docusaurus-gqlmd"
ARG --global gqlmdCliProject="cli-gqlmd"

FROM docker.io/library/node:$nodeVersion-alpine
RUN export NODE_ENV=ci
RUN npm install -g npm@$npmVersion
RUN npm config set update-notifier false
WORKDIR /graphql-markdown

deps:
  COPY *.json ./
  COPY --dir config packages scripts ./
  RUN HUSKY=0 npm ci

lint: 
  FROM +deps
  RUN npm run ts:check
  RUN npm run prettier -- --check
  RUN npm run lint

build:
  FROM +lint
  RUN npm run build

unit-test:
  FROM +build
  RUN npm run test:ci /unit

integration-test:
  FROM +build
  RUN npm run test:ci /integration

mutation-test:
  FROM +build
  RUN npm run stryker --workspaces --if-present -- --allowEmpty --reporters progress,html
  IF [ ! $(EARTHLY_CI) ]
    SAVE ARTIFACT reports AS LOCAL ./reports
  END

build-package:
  FROM +build
  ARG --required package
  WORKDIR /graphql-markdown
  RUN npm pack --workspace @graphql-markdown/$package | tail -n 1 | xargs -t -I{} mv {} graphql-markdown-$package.tgz
  SAVE ARTIFACT graphql-markdown-$package.tgz

build-docusaurus-project:
  FROM +build
  WORKDIR /
  IF [ "$docusaurusVersion" = "2" ]
    RUN npx --quiet create-docusaurus@$docusaurusVersion "$docusaurusProject" classic --skip-install
  ELSE
    RUN npx --quiet create-docusaurus@$docusaurusVersion "$docusaurusProject" classic --skip-install --javascript 
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
  RUN npm install ./graphql-markdown-cli.tgz
  COPY --dir ./packages/cli/tests/__data__ ./data

setup-docusaurus-project:
  FROM +build-docusaurus-project
  WORKDIR /$docusaurusProject
  DO +INSTALL_GRAPHQL
  DO +INSTALL_GQLMD
  RUN npm install ./graphql-markdown-cli.tgz
  RUN npm install ./graphql-markdown-docusaurus.tgz
  COPY --dir ./packages/docusaurus/tests/__data__ ./data
  COPY --dir ./website/static/img ./static/img
  COPY --dir ./website/src/css ./src/css
  RUN mv ./data/.graphqlrc ./.graphqlrc
  RUN mv ./data/docusaurus2-graphql-doc-build.js ./docusaurus2-graphql-doc-build.js
  RUN mv ./data/docusaurus2-graphql-doc-nobuild.js ./docusaurus2-graphql-doc-nobuild.js
  RUN mv ./data/scripts/config-plugin.js ./config-plugin.js
  RUN node config-plugin.js

smoke-docusaurus-test:
  FROM +setup-docusaurus-project
  WORKDIR /$docusaurusProject
  RUN npm install -g jest 
  RUN npm install graphql-config
  COPY --dir ./packages/docusaurus/tests/e2e ./__tests__/e2e
  COPY --dir ./packages/docusaurus/tests/helpers ./__tests__/helpers
  RUN mv ./__tests__/e2e/jest.config.js ./jest.config.js
  RUN npx jest --runInBand

smoke-cli-test:
  FROM +setup-cli-project
  WORKDIR /$gqlmdCliProject
  RUN npm install -g jest 
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
  RUN npm install prettier
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
  RUN npm install prettier
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
  FROM +deps
  COPY ./docs/__api/__index.md /graphql-markdown/docs/__api/__index.md
  RUN npm run docs:api
  SAVE ARTIFACT ./api

build-docs:
  COPY ./website ./
  COPY (+build-docusaurus-examples/examples) ./examples
  COPY (+build-api-docs/api) ./api
  COPY --dir docs .
  RUN npm install
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
    RUN npx $command graphql-to-doc $options 2>&1 | tee ./run.log
  ELSE
    RUN npx $command graphql-to-doc:${id} $options 2>&1 | tee ./run.log
  END
  RUN test `grep -c -i "An error occurred" run.log` -eq 0 && echo "Success" || (echo "Failed with errors"; exit 1) 

INSTALL_GQLMD:
  FUNCTION
  FOR package IN $(node /graphql-markdown/scripts/build-packages.js)
    COPY (+build-package/graphql-markdown-${package}.tgz --package=${package}) ./
    IF [ "$package" != "docusaurus" ]
      RUN npm install ./graphql-markdown-${package}.tgz
    END
  END

INSTALL_DOCUSAURUS:
  FUNCTION
  RUN npm install
  RUN npm upgrade @docusaurus/core @docusaurus/preset-classic

INSTALL_GRAPHQL:
  FUNCTION
  RUN npm install graphql @graphql-tools/url-loader @graphql-tools/graphql-file-loader
