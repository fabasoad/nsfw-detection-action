#!/usr/bin/env sh

# Validates value to be a non-empty string.
# Parameters:
# 1. (Required) Param name to display it correctly in the error message for the
#    users.
# 2. (Required) Param value that will be validated.
check_is_not_empty() {
  if [ -z "${2}" ]; then
    echo "::error title=Invalid parameter::\"${1}\" parameter is empty."
    exit 1
  fi
}

# Validates string to be one of the possible values (emulating enum data type).
# Parameters:
# 1. (Required) Param name to display it correctly in the error message for the
#    users.
# 2. (Required) Param value that will be validated.
# 3. (Required) Possible values for the param value to be valid.
#
# Usage examples:
# check_enum "my-bool-param" "true" "true,false"
# check_enum "my-days-of-week-param" "wed" "mon,tue,wed,thu,fri,sat,sun"
check_enum() {
  case ",${3}," in
    *",${2},"*)
      ;;
    *)
      msg="\"${1}\" parameter is invalid. Possible values: $(echo "${3}" | sed 's/,/, /g')."
      echo "::error title=Invalid parameter::${msg}"
      exit 1
      ;;
  esac
}

# Validates input to be a valid number.
# Parameters:
# 1. (Required) Param name to display it correctly in the error message for the
#    users.
# 2. (Required) Param value that will be validated.
#
# Usage examples:
# - Positive cases:
#   check_number "my-param-1" "1"
#   check_number "my-param-2" "0.52"
# - Negative cases:
#   check_number "my-param-3" "string"
#   check_number "my-param-4" ""
check_number() {
  if [ "${2}" -ne "${2}" ] 2>/dev/null; then
    msg="\"${1}\" parameter is invalid. It should be a number."
    echo "::error title=Invalid parameter::${msg}"
    exit 1
  fi
}

main() {
  input_provider="${1}"
  input_api_key="${2}"
  input_threshold="${3}"
  input_extensions="${4}"
  input_types="${5}"

  check_enum "provider" "${input_provider}" "cloudmersive,picpurify,sightengine"
  check_is_not_empty "api-key" "${input_api_key}"
  check_number "threshold" "${input_threshold}"
  check_is_not_empty "extensions" "${input_extensions}"
  check_is_not_empty "types" "${input_type}"
  echo "${input_types}" | while IFS=',' read -r input_type; do
    check_enum "types" "${input_type}" "added,copied,modified,renamed"
  done
}

main "$@"
