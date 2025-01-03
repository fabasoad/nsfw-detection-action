#!/usr/bin/env sh

SCRIPT_PATH=$(realpath "$0")
PROVIDERS_DIR_PATH=$(dirname "$SCRIPT_PATH")
SRC_DIR_PATH=$(dirname "$PROVIDERS_DIR_PATH")
LIB_DIR_PATH="${SRC_DIR_PATH}/lib"

. "${LIB_DIR_PATH}/logging.sh"

main() {
  url="https://api.cloudmersive.com/image/nsfw/classify"
  files="${1}"
  api_key="${2}"

  result="[]"
  for file_path in ${files}; do
    log_debug "Classifying ${file_path}..."
    response=$(curl -sL \
      -X POST "${url}" \
      --header "Content-Type: multipart/form-data" \
      --header "Apikey: ${api_key}" \
      --form "imageFile=@${file_path}")
    if [ "$(echo "${response}" | jq -r '.Successful')" = "true" ]; then
      # Getting score
      score=$(echo "${response}" | jq -r '.Score')
      # Build object for the output
      obj="$(jq -n \
        --arg f "${file_path}" \
        --arg s "${score}" \
        '{file: $f, score: $s | tonumber}')"
      # Add object to the resulting array
      result=$(echo "${result}" | jq --argjson obj "${obj}" '. += [$obj]')
      log_info "Classified ${file_path} with score ${score}"
    else
      msg="There was a problem during ${file_path} file classification."
      log_warning "${msg}"
    fi
  done
  echo "scores=${result}" >> "$GITHUB_OUTPUT"
}

main "$@"
