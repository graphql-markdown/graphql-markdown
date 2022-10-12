#!/bin/bash
set -e

COVERAGE_DIR=.nyc_output
COVERAGE_FILE=coverage-final.json

for FILE in $(find $COVERAGE_DIR -name $COVERAGE_FILE); do
  mv "$FILE" $COVERAGE_DIR/$(basename $(dirname "$FILE")).json
done
npx -y --quiet nyc merge --nycrc-path ./tools/nyc.config.js $COVERAGE_DIR $COVERAGE_DIR/coverage.json
npx -y --quiet nyc report --nycrc-path ./tools/nyc.config.js --reporter=lcov --reporter=text --check-coverage
