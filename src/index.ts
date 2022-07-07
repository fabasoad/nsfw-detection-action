import { getInput, setFailed, error, warning, info } from '@actions/core'
import {
  NsfwDetectionProviderFactory
} from './translation/NsfwDetectionProviderFactory'
import { GitHubClient } from './utils/GitHubClient'

async function run() {
  try {
    const threshold = Number(getInput('threshold'))
    const provider =
        NsfwDetectionProviderFactory.getProvider(getInput('provider'))
    const githubClient = new GitHubClient()
    const files: Set<string> = await githubClient.getChangedFiles(
      getInput('github_token'),
      getInput('type').split(','),
      getInput('extensions').split(',')
    )

    let count = 0
    for (const file of files) {
      const score: number = await provider.getScore(getInput('api_key'), file)
      const result: number = threshold - score
      if (result < 0) {
        count++
        error(`${file} file is detected as NSFW (score is ${score})`)
      } else if (result > 5) {
        info(`${file} is safe to be used (score is ${score})`)
      } else {
        warning(
          `${file} file is close to be detected as NSFW (score is ${score})`)
      }
    }
    if (count > 0) {
      setFailed(`There ${count > 1 ? 'are' : 'is'} ${count} ` +
        `file${count > 1 ? 's' : ''} ha${count > 1 ? 've' : 's'}` +
        'been detected as NSFW')
    }
  } catch (e) {
    setFailed((<Error>e).message)
  }
}

run()
