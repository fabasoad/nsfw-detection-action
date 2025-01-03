#!/usr/bin/env sh

compare_with_threshold() {
  score="${1}"
  threshold="${2}"
  file_path="${3}"

  if awk -v t="${threshold}" -v s="${score}" 'BEGIN {exit !((t - s) < 0)}'; then
    log_error "NSFW content detected in ${file_path} with score ${score}."
    exit 1
  elif awk -v t="${threshold}" -v s="${score}" 'BEGIN {exit !((t - s) > 0.3)}'; then
    log_info "No NSFW content detected in ${file_path} with score ${score}."
  else
    log_warning "${file_path} with score ${score} is close to be considered as NSFW content."
  fi
}
