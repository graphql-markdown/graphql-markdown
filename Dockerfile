FROM docker/dev-environments-javascript:latest as developement  
WORKDIR /node/src/github.com/edno/graphql-markdown
COPY . .

RUN yarn install --frozen-lockfile
