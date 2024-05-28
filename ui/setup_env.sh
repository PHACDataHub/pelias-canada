#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

env_file="./.env.cloud_build"
rm -f "${env_file}"
touch "${env_file}"

# Default values if triggered locally
branch_name="${BRANCH_NAME:-$(git rev-parse --abbrev-ref HEAD)}"
commit_sha="${COMMIT_SHA:-$(git rev-parse HEAD)}"
short_sha="${commit_sha:0:7}"

bash_escape (){
  printf "%q\n" "${1}"
}

# Generate commit tag and image tags
commit_tag="main-${short_sha}-$(date +%Y%m%d%H%M%S)"
image_tag="${branch_name}-${short_sha}-$(date +%s)"
bash_escape "COMMIT_TAG=${commit_tag}" >> "${env_file}"
bash_escape "IMAGE_TAG=${image_tag}" >> "${env_file}"