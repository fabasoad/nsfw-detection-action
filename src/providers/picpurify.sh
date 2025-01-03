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

  result="[]"
  for file_path in ${files}; do
    log_debug "Classifying ${file_path}..."
    response=$(curl -s \
      -X POST "${url}" \
      -F "API_KEY=${api_key}" \
      -F "task=porn_moderation,suggestive_nudity_moderation" \
      -F "file_image=@${file_path}")
    if [ "$(echo "${response}" | jq -r '.status')" = "success" ]; then
      # Getting score
      score=$(echo "${response}" | jq -r '.confidence_score_decision')
      # Build object for the output
      obj="$(jq -n \
        --arg f "${file_path}" \
        --arg s "${score}" \
        '{file: $f, score: $s | tonumber}')"
      # Add object to the resulting array
      result=$(echo "${result}" | jq -c --argjson obj "${obj}" '. += [$obj]')
      log_info "Classified ${file_path} with score ${score}"
    else
      msg="There was a problem during ${file_path} file classification."
      if [ -n "${response}" ] && [ "$(echo "${response}" | jq 'has("error")')" = "true" ]; then
        msg="${msg} $(echo "${response}" | jq -r '.error | "Code: \(.errorCode). Reason: \(.errorMsg)"')"
      fi
      log_warning "${msg}"
    fi
  done
  echo "scores=${result}" >> "$GITHUB_OUTPUT"
}

main "$@"
