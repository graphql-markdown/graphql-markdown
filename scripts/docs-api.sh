#!/bin/sh

API_DIR=./api

npm run build

npm run typedoc -- --out ${API_DIR}

find ${API_DIR}/*/ -type f \( -name "modules.md" -or -name "index.md" \) -delete
rm ${API_DIR}/modules.md

for depth in 1 2 3; do
  for folder in $(find ${API_DIR}/*/ -mindepth ${depth} -maxdepth ${depth} -type d); do 
    if [ ${depth} -eq 1 ]; then 
      prefix=@graphql-markdown/; 
    else 
      prefix=;
    fi;
    echo "{ \"label\": \"${prefix}$(basename ${folder})\", \"link\": { \"type\": \"generated-index\" } }" > ${folder}/_category_.json;
  done;
done;

mv ${API_DIR}/@graphql-markdown/* ${API_DIR}/

rm -rf ${API_DIR}/@graphql-markdown
