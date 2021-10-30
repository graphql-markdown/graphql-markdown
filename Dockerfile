FROM node:lts-alpine as build  
WORKDIR /node/src/github.com/edno/graphql-markdown
COPY . .

RUN yarn install --frozen-lockfile
CMD ["/bin/sh"]
