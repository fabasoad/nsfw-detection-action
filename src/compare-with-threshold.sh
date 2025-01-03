#!/usr/bin/env sh

compare_with_threshold() {
  score="${1}"
  threshold="${2}"
  file_path="${3}"

  result=$((threshold - score))
  if awk -v r="${result}" 'BEGIN {exit !(r < 0)}'; then
    log_error "NSFW content detected in ${file_path} with score ${score}."
    exit 1
  elif awk -v r="${result}" 'BEGIN {exit !(r > 0.3)}'; then
    log_info "No NSFW content detected in ${file_path} with score ${score}."
  else
    log_warning "${file_path} with score ${score} is close to be considered as NSFW content."
  fi
}
