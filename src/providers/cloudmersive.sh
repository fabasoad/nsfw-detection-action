#!/usr/bin/env sh

SCRIPT_PATH=$(realpath "$0")
PROVIDERS_DIR_PATH=$(dirname "$SCRIPT_PATH")
SRC_DIR_PATH=$(dirname "$PROVIDERS_DIR_PATH")
LIB_DIR_PATH="${SRC_DIR_PATH}/lib"

. "${SRC_DIR_PATH}/compare-with-threshold.sh"
. "${LIB_DIR_PATH}/logging.sh"

main() {
  url="https://api.cloudmersive.com/image/nsfw/classify"
  files="${1}"
  type="${2}"
  api_key="${3}"
  threshold="${4}"

  for file_path in ${files}; do
    log_debug "Classifying ${type} ${file_path} file..."
    response=$(curl -sL \
      -X POST "${url}" \
      --header "Content-Type: multipart/form-data" \
      --header "Apikey: ${api_key}" \
      --form "imageFile=@${file_path}")
    if [ "$(echo "${response}" | jq -r '.Successful')" = "true" ]; then
      score=$(echo "${response}" | jq -r '.Score')
      compare_with_threshold "${score}" "${threshold}" "${file_path}"
    else
      msg="There was a problem during ${file_path} file classification."
      log_warning "${msg}"
    fi
  done
}

main "$@"
