#!/usr/bin/env sh

SCRIPT_PATH=$(realpath "$0")
PROVIDERS_DIR_PATH=$(dirname "$SCRIPT_PATH")
SRC_DIR_PATH=$(dirname "$PROVIDERS_DIR_PATH")
LIB_DIR_PATH="${SRC_DIR_PATH}/lib"

. "${SRC_DIR_PATH}/compare-with-threshold.sh"
. "${LIB_DIR_PATH}/logging.sh"

# Returns MIME type by file extension. OpenAI Moderation API supports
# jpeg, png, gif and webp images. Other extensions (e.g. tiff, bmp from
# the default "extensions" input) are sent with their MIME type as well
# and rejected by the API, which is handled as a warning below, the same
# way other providers handle classification problems.
mime_type() {
  extension="$(echo "${1##*.}" | tr '[:upper:]' '[:lower:]')"
  case "${extension}" in
    jpg | jpeg)
      echo "image/jpeg"
      ;;
    png)
      echo "image/png"
      ;;
    gif)
      echo "image/gif"
      ;;
    webp)
      echo "image/webp"
      ;;
    tiff)
      echo "image/tiff"
      ;;
    bmp)
      echo "image/bmp"
      ;;
    *)
      echo "application/octet-stream"
      ;;
  esac
}

main() {
  url="https://api.openai.com/v1/moderations"
  files="${1}"
  type="${2}"
  api_key="${3}"
  threshold="${4}"

  for file_path in ${files}; do
    log_debug "Classifying ${type} ${file_path}..."
    # The image is sent as a base64 encoded data URL in a JSON body.
    # The body is streamed to curl via stdin ("--data-binary @-") instead
    # of a command line argument, because a base64 encoded image can
    # exceed the maximum length of a single command line argument.
    response=$(
      {
        printf '%s' '{"model":"omni-moderation-latest","input":[{"type":'
        printf '%s' '"image_url","image_url":{"url":"data:'
        printf '%s;base64,' "$(mime_type "${file_path}")"
        base64 <"${file_path}" | tr -d '\n'
        printf '%s' '"}}]}'
      } | curl -s \
        -X POST "${url}" \
        --header "Content-Type: application/json" \
        --header "Authorization: Bearer ${api_key}" \
        --data-binary @-
    )
    score=$(echo "${response}" | jq -r \
      '.results[0].category_scores.sexual // empty')
    if [ -n "${score}" ]; then
      compare_with_threshold "${score}" "${threshold}" "${file_path}"
    else
      msg="There was a problem during ${file_path} file classification."
      if [ -n "${response}" ] && [ "$(echo "${response}" | jq 'has("error")')" = "true" ]; then
        msg="${msg} $(echo "${response}" | jq -r \
          '.error | "Type: \(.type). Code: \(.code). Reason: \(.message)"')"
      fi
      log_warning "${msg}"
    fi
  done
}

main "$@"
