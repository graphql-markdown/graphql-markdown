#!/bin/sh

API_DIR=./api
WORKSPACE=@graphql-markdown

npm run build

export NODE_OPTIONS=--max_old_space_size=8192
npm run typedoc -- --skipErrorChecking --logLevel Error --out ${API_DIR}

find ${API_DIR}/*/ -type f \( -name "modules.md" -or -name "index.md" \) -delete
rm -f ${API_DIR}/packages.md

for depth in 1 2 3; do
  for folder in $(find ${API_DIR}/*/ -mindepth ${depth} -maxdepth ${depth} -type d); do 
    if [ ${depth} -eq 1 ]; then 
      prefix=${WORKSPACE}/; 
    else 
      prefix=;
    fi;
    echo "{ \"label\": \"${prefix}$(basename ${folder})\", \"link\": { \"type\": \"generated-index\" } }" > ${folder}/_category_.json;
  done;
done;

mv ${API_DIR}/${WORKSPACE}/* ${API_DIR}/

rm -rf ${API_DIR}/${WORKSPACE}
