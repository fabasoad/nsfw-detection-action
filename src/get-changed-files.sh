#!/usr/bin/env sh

SCRIPT_PATH=$(realpath "$0")
SRC_DIR_PATH=$(dirname "$SCRIPT_PATH")
LIB_DIR_PATH="${SRC_DIR_PATH}/lib"

. "${LIB_DIR_PATH}/logging.sh"

list_files_by_type() {
  base_sha="${1}"
  head_sha="${2}"
  types="${3}"
  type="${4}"
  type_modifier="${5}"
  case ",${types}," in
    *",${type},"*)
      git diff --name-status "${base_sha}" "${head_sha}" \
        | grep "^${type_modifier}" \
        | cut -f2
      ;;
  esac
}

list_changed_files() {
  base_sha="${1}"
  head_sha="${2}"
  types="${3}"
  list_files_by_type "${base_sha}" "${head_sha}" "${types}" "added" "A"
  list_files_by_type "${base_sha}" "${head_sha}" "${types}" "modified" "M"
  list_files_by_type "${base_sha}" "${head_sha}" "${types}" "renamed" "R"
}

main() {
  base_sha="${1}"
  head_sha="${2}"
  types="${3}"
  extensions="${4}"
  echo "files<<EOF" >> "$GITHUB_OUTPUT"
  for file_path in $(list_changed_files "${base_sha}" "${head_sha}" "${types}"); do
    filename=$(basename "${file_path}")
    extension="${filename##*.}"
    case ",${extensions}," in
      *",${extension},"*)
        log_info "${file_path} will be classified"
        echo "${file_path}" >> "$GITHUB_OUTPUT"
        ;;
      *)
        log_info "${file_path} will not be classified"
        ;;
    esac
  done
  echo "EOF" >> "$GITHUB_OUTPUT"
}

main "$@"
