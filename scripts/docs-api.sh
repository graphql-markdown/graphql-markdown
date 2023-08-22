#!/bin/sh

API_DIR=./api

npm run typedoc -- --out ${API_DIR}

find ${API_DIR}/*/ -type f \( -name "index.md" -or -name "index" \) -delete

for d in $(find ${API_DIR}/*/ -mindepth 1 -type d); do 
  echo "{ \"label\": \"@graphql-markdown/$(basename ${d})\", \"link\": { \"type\": \"generated-index\" } }" > ${d}/_category_.json;
done;

mv ${API_DIR}/@graphql-markdown/* ${API_DIR}/

rm -rf ${API_DIR}/@graphql-markdown
