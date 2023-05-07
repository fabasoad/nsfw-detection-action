# NSFW detection action

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/fabasoad/nsfw-detection-action?include_prereleases)
![Unit Tests](https://github.com/fabasoad/nsfw-detection-action/workflows/Unit%20Tests/badge.svg)
![Functional Tests](https://github.com/fabasoad/nsfw-detection-action/workflows/Functional%20Tests/badge.svg)
![Security Tests](https://github.com/fabasoad/nsfw-detection-action/workflows/Security%20Tests/badge.svg)
![pre-commit](https://github.com/fabasoad/nsfw-detection-action/actions/workflows/pre-commit.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/4b83792aebf367a33f6c/maintainability)](https://codeclimate.com/github/fabasoad/nsfw-detection-action/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/4b83792aebf367a33f6c/test_coverage)](https://codeclimate.com/github/fabasoad/nsfw-detection-action/test_coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/nsfw-detection-action/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/nsfw-detection-action?targetFile=package.json)

This action checks each modified and added file with the extensions that is defined
in action configuration and failed in case of threshold of NSFW check is greater
or equals to the threshold defined in action configuration. NSFW detection runs
by chosen provider.

## Contents

- [Providers](#providers)
  - [Cloudmersive](#cloudmersive)
  - [DeepAI](#deepai)
  - [PicPurify](#picpurify)
  - [SightEngine](#sightengine)
- [Inputs](#inputs)
- [Example usage](#example-usage)

## Providers

### Cloudmersive

Identifier is `cloudmersive`. Sign up to [Cloudmersive](https://cloudmersive.com/)
official website. Then go to [API Keys](https://account.cloudmersive.com/keys)
page, create a new one and copy it.

### DeepAI

Identifier is `deepai`. Sign up to [DeepAI](https://deepai.org/) official website.
Then go to [Profile](https://deepai.org/dashboard/profile) page and copy `api-key`
that is located on the top of the page.

### PicPurify

Identifier is `picpurify`. Sign up to [PicPurify](https://www.picpurify.com/)
official website. Then go to [API Keys](https://www.picpurify.com/apikey.html)
page and copy `API key` that is located on the top of the page.

### SightEngine

Identifier is `sightengine`. Sign up to [SightEngine](https://sightengine.com/)
official website. Then go to [Get Started](https://dashboard.sightengine.com/getstarted)
page and copy API user and API secret from the examples provided. This provider
requires to provide 2 API identifiers, so please put them into `api_key` parameter
separated by comma. For example, your `api_user` is _123456_ and `api_secret` is
_abcdef_, so `api_key` should be _123456,abcdef_.

## Inputs

| Name         | Required | Description                                                                                   | Default                          | Possible values                  |
|--------------|----------|-----------------------------------------------------------------------------------------------|----------------------------------|----------------------------------|
| github_token | Yes      | GitHub token                                                                                  |                                  | &lt;String&gt;                   |
| provider     | Yes      | Provider identifier                                                                           |                                  | &lt;String&gt;                   |
| api_key      | Yes      | API key that should be used for chosen `provider`                                             |                                  | &lt;String&gt;                   |
| threshold    | Yes      | Action will be failed in case NSFW detection value will be greater or equal to this parameter |                                  | &lt;Float&gt;                    |
| type         | No       | Type of committed files separated by comma                                                    | `modified,added,renamed`         | `modified,added,renamed`         |
| extensions   | No       | List of file extensions separated by comma                                                    | `jpeg,jpg,png,gif,webp,tiff,bmp` | `jpeg,jpg,png,gif,webp,tiff,bmp` |

## Example usage

### Workflow configuration

```yaml
name: Test

on: push

jobs:
  nsfw-detection:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@main
      - uses: fabasoad/nsfw-detection-action@main
        with:
          provider: deepai
          threshold: 0.9
          type: modified,added,renamed
          extensions: jpg,jpeg
          github_token: ${{ secrets.GITHUB_TOKEN }}
          api_key: ${{ secrets.DEEPAI_API_KEY }}
```

### Result

![Result](screenshot.png)
