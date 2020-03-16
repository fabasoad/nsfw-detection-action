# NSFW detection action
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/fabasoad/nsfw-detection-action?include_prereleases) ![NSFW detection (latest)](https://github.com/fabasoad/nsfw-detection-action/workflows/nsfw%20detection%20(latest)/badge.svg) ![NSFW detection (master)](https://github.com/fabasoad/nsfw-detection-action/workflows/Niduty%20detection%20(master)/badge.svg) ![CI](https://github.com/fabasoad/nsfw-detection-action/workflows/CI/badge.svg) ![YAML Lint](https://github.com/fabasoad/nsfw-detection-action/workflows/YAML%20Lint/badge.svg)

This action checks each modified and added file with the extensions that is defined in action configuration and failed incase of threshold of NSFW check is greater or equals to the threshold defined in action configuration. NSFW detection runs by chosen provider.

## Contents
- [Providers](#providers)
  - [DeepAI](#deepai)
- [Inputs](#inputs)
- [Example usage](#example-usage)

## Providers

### DeepAI
#### Description
Identifier is `deepai`.
#### How to get API key
Sign up to [DeepAI](https://deepai.org/) official website. Then go to [Profile](https://deepai.org/dashboard/profile) page and copy `api-key` that is located on the top of the page.

## Inputs
1. `github_token` - _[Required]_ GitHub token. 
2. `provider` - _[Required]_ Provider identifier.
3. `api_key` - _[Required]_ API key that should be used for chosen `provider`.
4. `threshold` - _[Required]_ Action will be failed in case NSFW detection value will be greater or equal to this parameter.
5. `type` - _[Optional]_ Type of commited files separated by comma. Default: `modified,added`.
6. `extensions` - _[Optional]_ List of extensions separated by comma. Default: `jpeg,jpg,png,gif,webp,tiff,bmp`.

## Example usage

### Workflow configuration

```yaml
name: Test

on: push

jobs:
  nsfw-detection:
    name: Run NSFW detection job
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: fabasoad/nsfw-detection-action@v1.0.0
        with:
          provider: deepai
          threshold: 0.9
          type: modified,added
          extensions: jpg,jpeg
          github_token: ${{ secrets.GITHUB_TOKEN }}
          api_key: ${{ secrets.DEEPAI_API_KEY }}
```

### Result
![Result](https://raw.githubusercontent.com/fabasoad/nsfw-detection-action/master/screenshot.png)
