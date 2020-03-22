# NSFW detection action
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/fabasoad/nsfw-detection-action?include_prereleases) ![CI](https://github.com/fabasoad/nsfw-detection-action/workflows/CI/badge.svg)  ![YAML Lint](https://github.com/fabasoad/nsfw-detection-action/workflows/YAML%20Lint/badge.svg) [![Total alerts](https://img.shields.io/lgtm/alerts/g/fabasoad/nsfw-detection-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/nsfw-detection-action/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/fabasoad/nsfw-detection-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/nsfw-detection-action/context:javascript) [![Maintainability](https://api.codeclimate.com/v1/badges/4b83792aebf367a33f6c/maintainability)](https://codeclimate.com/github/fabasoad/nsfw-detection-action/maintainability) [![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/nsfw-detection-action/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/nsfw-detection-action?targetFile=package.json)

This action checks each modified and added file with the extensions that is defined in action configuration and failed incase of threshold of NSFW check is greater or equals to the threshold defined in action configuration. NSFW detection runs by chosen provider.

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
Identifier is `cloudmersive`. Sign up to [Cloudmersive](https://cloudmersive.com/) official website. Then go to [API Keys](https://account.cloudmersive.com/keys) page, create a new one and copy it.

### DeepAI
Identifier is `deepai`. Sign up to [DeepAI](https://deepai.org/) official website. Then go to [Profile](https://deepai.org/dashboard/profile) page and copy `api-key` that is located on the top of the page.

### PicPurify
Identifier is `picpurify`. Sign up to [PicPurify](https://www.picpurify.com/) official website. Then go to [API Keys](https://www.picpurify.com/apikey.html) page and copy `API key` that is located on the top of the page.

### SightEngine
Identifier is `sightengine`. Sign up to [SightEngine](https://sightengine.com/) official website. Then go to [Get Started](https://dashboard.sightengine.com/getstarted) page and copy API user and API secret from the examples provided. This provider requires to provide 2 API identifiers, so please put them into `api_key` parameter separated by comma. For example, your `api_user` is _123456_ and `api_secret` is _abcdef_, so `api_key` should be _123456,abcdef_.

## Inputs
1. `github_token` - _[Required]_ GitHub token. 
2. `provider` - _[Required]_ Provider identifier.
3. `api_key` - _[Required]_ API key that should be used for chosen `provider`.
4. `threshold` - _[Required]_ Action will be failed in case NSFW detection value will be greater or equal to this parameter.
5. `type` - _[Optional]_ Type of commited files separated by comma. Default: `modified,added,renamed`.
6. `extensions` - _[Optional]_ List of extensions separated by comma. Default: `jpeg,jpg,png,gif,webp,tiff,bmp`.

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
      - uses: actions/checkout@v1
      - uses: fabasoad/nsfw-detection-action@v1.3.0
        with:
          provider: deepai
          threshold: 0.9
          type: modified,added,renamed
          extensions: jpg,jpeg
          github_token: ${{ secrets.GITHUB_TOKEN }}
          api_key: ${{ secrets.DEEPAI_API_KEY }}
```

### Result
![Result](https://raw.githubusercontent.com/fabasoad/nsfw-detection-action/master/screenshot.png)
