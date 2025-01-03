#!/usr/bin/env sh

SCRIPT_PATH=$(realpath "$0")
PROVIDERS_DIR_PATH=$(dirname "$SCRIPT_PATH")
SRC_DIR_PATH=$(dirname "$PROVIDERS_DIR_PATH")
LIB_DIR_PATH="${SRC_DIR_PATH}/lib"

. "${LIB_DIR_PATH}/logging.sh"

main() {
  url="https://api.sightengine.com/1.0/check.json"
  files="${1}"
  api_user="$(echo "${2}" | cut -d',' -f1)"
  api_secret="$(echo "${2}" | cut -d',' -f2)"

  result="[]"
  for file_path in ${files}; do
    log_debug "Classifying ${file_path}..."
    response=$(curl -s \
      -X POST "${url}" \
      -F "media=@${file_path}" \
      -F "models=nudity-2.1" \
      -F "api_user=${api_user}" \
      -F "api_secret=${api_secret}")
    if [ "$(echo "${response}" | jq -r '.status')" = "success" ]; then
      # Getting maximum score
      score=$(echo "${response}" | jq -r '.nudity | [.sexual_activity, .sexual_display, .erotica] | max')
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
        msg="${msg} $(echo "${response}" | jq -r '.error | "Type: \(.type). Code: \(.code). Reason: \(.message)"')"
      fi
      log_warning "${msg}"
    fi
  done
  echo "scores=${result}" >> "$GITHUB_OUTPUT"
}

main "$@"
