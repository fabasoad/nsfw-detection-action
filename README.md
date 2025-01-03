# NSFW detection action

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/fabasoad/nsfw-detection-action?include_prereleases)
![unit-tests](https://github.com/fabasoad/nsfw-detection-action/actions/workflows/unit-tests.yml/badge.svg)
![functional-tests](https://github.com/fabasoad/nsfw-detection-action/actions/workflows/functional-tests.yml/badge.svg)
![security](https://github.com/fabasoad/nsfw-detection-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/nsfw-detection-action/actions/workflows/linting.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/4b83792aebf367a33f6c/maintainability)](https://codeclimate.com/github/fabasoad/nsfw-detection-action/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/4b83792aebf367a33f6c/test_coverage)](https://codeclimate.com/github/fabasoad/nsfw-detection-action/test_coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/nsfw-detection-action/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/nsfw-detection-action?targetFile=package.json)

This action checks each modified and added file with the extensions that is defined
in action configuration and failed in case of threshold of NSFW check is greater
or equals to the threshold defined in action configuration. NSFW detection runs
by chosen provider.

## Contents

<!-- prettier-ignore-start -->
<!-- TOC -->
* [NSFW detection action](#nsfw-detection-action)
  * [Contents](#contents)
  * [Providers](#providers)
    * [Cloudmersive](#cloudmersive)
    * [PicPurify](#picpurify)
    * [SightEngine](#sightengine)
  * [Supported OS](#supported-os)
  * [Prerequisites](#prerequisites)
  * [Inputs](#inputs)
  * [Outputs](#outputs)
<!-- TOC -->
<!-- prettier-ignore-end -->

## Providers

### Cloudmersive

Identifier is `cloudmersive`. Sign up to [Cloudmersive](https://cloudmersive.com/)
official website. Then go to [API Keys](https://account.cloudmersive.com/keys)
page, create a new one and copy it.

### PicPurify

Identifier is `picpurify`. Sign up to [PicPurify](https://www.picpurify.com/)
official website. Then go to [API Keys](https://www.picpurify.com/apikey.html)
page and copy `API key` that is located on the top of the page.

### SightEngine

Identifier is `sightengine`. Sign up to [SightEngine](https://sightengine.com/)
official website. Then go to [Get Started](https://dashboard.sightengine.com/getstarted)
page and copy API user and API secret from the examples provided. This provider
requires to provide 2 API identifiers, so please put them into `api-key` parameter
separated by comma. For example, `api-key` should be _123456,abcdef_ if your
`api_user` is _123456_ and `api_secret` is _abcdef_.

## Supported OS

<!-- prettier-ignore-start -->
| OS      |                    |
|---------|--------------------|
| Windows | :white_check_mark: |
| Linux   | :white_check_mark: |
| macOS   | :white_check_mark: |
<!-- prettier-ignore-end -->

## Prerequisites

The following tools have to be installed for successful work of this GitHub Action:
[curl](https://curl.se), [awk](https://en.wikipedia.org/wiki/AWK).

## Inputs

```yaml
- uses: fabasoad/nsfw-detection-action@v3
  with:
    # (Required) Provider identifier.
    provider: "picpurify"
    # (Required) API key required for the selected provider.
    api-key: ${{ secrets.PICPURIFY_API_KEY }}
    # (Required) The action will fail if the NSFW detection value is greater
    # than or equal to this parameter.
    threshold: "0.6"
    # (Optional) Comma-separated list of file extensions for NSFW detection.
    # Defaults to "jpeg,jpg,png,gif,webp,tiff,bmp".
    extensions: "jpg,png,gif"
    # (Optional) Comma-separated types of changes made during work on the branch.
    # Defaults to "added,copied,modified,renamed".
    types: "added,modified"
```

## Outputs

None.
