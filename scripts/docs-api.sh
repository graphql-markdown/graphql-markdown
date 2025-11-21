#!/bin/sh

API_DIR=./api
WORKSPACE=@graphql-markdown

bun build

# export NODE_OPTIONS=--max_old_space_size=8192
bun typedoc -- --skipErrorChecking --logLevel Error --out ${API_DIR}

find ${API_DIR}/*/ -type f \( -name "modules.md" -or -name "generated.md" \) -delete
rm -f ${API_DIR}/packages.md
mv ${API_DIR}/generated.md ${API_DIR}/index.md

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
