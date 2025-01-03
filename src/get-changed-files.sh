#!/usr/bin/env sh

main() {
  base_sha="${1}"
  added="${2}"
  modified="${3}"
  renamed="${4}"
  if [ "${added}" = "true" ]; then
    git diff --name-status $(git merge-base HEAD "${base_sha}") HEAD | grep '^A' | cut -f2
  fi
  if [ "${modified}" = "true" ]; then
    git diff --name-status $(git merge-base HEAD "${base_sha}") HEAD | grep '^M' | cut -f2
  fi
  if [ "${renamed}" = "true" ]; then
    git diff --name-status $(git merge-base HEAD "${base_sha}") HEAD | grep '^R' | cut -f2
  fi
}

main "$@"
