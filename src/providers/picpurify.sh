#!/usr/bin/env sh

SCRIPT_PATH=$(realpath "$0")
PROVIDERS_DIR_PATH=$(dirname "$SCRIPT_PATH")
SRC_DIR_PATH=$(dirname "$PROVIDERS_DIR_PATH")
LIB_DIR_PATH="${SRC_DIR_PATH}/lib"

. "${LIB_DIR_PATH}/logging.sh"

main() {
  url="https://www.picpurify.com/analyse/1.1"
  files="${1}"
  api_key="${2}"

  for file_path in ${files}; do
    response=$(curl -s \
      -X POST "${url}" \
      -F "API_KEY=${api_key}" \
      -F "task=porn_moderation,suggestive_nudity_moderation" \
      -F "file_image=@/path/to/local/file.jpg")
    if [ "$(echo "${response}" | jq -r '.status')" = "success" ]; then
      score=$(echo "${response}" | jq -r '.confidence_score_decision')
      log_info "Classified ${file_path} with score ${score}"
    else
      msg="There was a problem during ${file_path} file classification. Code:"
      msg="${msg} $(echo "${response}" | jq -r '.error | "Code: \(.errorCode). Reason: \(.errorMsg)"')"
      log_warning "${msg}"
    fi
  done
}

main "$@"
