#!/usr/bin/env bash
# Runs graphql-to-doc against the current project, mirroring the old
# Earthfile `GQLMD` UDC.
set -euo pipefail

id=""
options=""
command="docusaurus"
runner="bunx"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --id) id="$2"; shift 2 ;;
    --options) options="$2"; shift 2 ;;
    --command) command="$2"; shift 2 ;;
    --runner) runner="$2"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

mkdir -p docs

gqlmd="graphql-to-doc"
if [[ -n "$id" ]]; then
  gqlmd="${gqlmd}:${id}"
fi

echo "Running command: $runner $command $gqlmd $options"
# Capture the runner's real exit status (PIPESTATUS[0]), not tee's, so a genuine
# failure is caught even though the pipeline's last command is tee. Disable -e
# around the pipe so we can report the status ourselves.
set +e
# shellcheck disable=SC2086
$runner $command $gqlmd $options 2>&1 | tee ./run.log
status=${PIPESTATUS[0]}
set -e
if [[ "$status" -ne 0 ]]; then
  echo "Failed: $runner exited with status $status" >&2
  exit "$status"
fi
# Belt-and-suspenders: some runs log errors without a non-zero exit code.
if grep -qE '^error:' ./run.log; then
  echo "Failed with errors" >&2
  exit 1
fi
echo "Success"
