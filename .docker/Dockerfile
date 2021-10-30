ARG nodeVersion=lts

FROM node:$nodeVersion-alpine as build  
WORKDIR /node/src/github.com/edno/graphql-markdown
COPY . .

RUN yarn install --frozen-lockfile

FROM build as development
RUN sudo /bin/sh -c 'wget https://github.com/earthly/earthly/releases/latest/download/earthly-linux-amd64 -O /usr/local/bin/earthly && chmod +x /usr/local/bin/earthly && /usr/local/bin/earthly bootstrap --with-autocomplete'
