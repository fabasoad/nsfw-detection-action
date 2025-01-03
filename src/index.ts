import { getInput, setFailed } from '@actions/core'
import { Logger } from 'winston'
import {
  NsfwDetectionProviderFactory
} from './detection/NsfwDetectionProviderFactory'
import { GitHubClient } from './utils/GitHubClient'
import { getLogger } from './utils/LoggerFactory'

async function run() {
  const logger: Logger = getLogger()
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
        // logger.error(`${file} file is detected as NSFW (score is ${score})`)
      } else if (result > 5) {
        // logger.info(`${file} is safe to be used (score is ${score})`)
      } else {
        // logger.warning(
        //   `${file} file is close to be detected as NSFW (score is ${score})`)
      }
    }
    if (count > 0) {
      setFailed(`There ${count > 1 ? 'are' : 'is'} ${count} ` +
        `file${count > 1 ? 's' : ''} ha${count > 1 ? 've' : 's'} ` +
        'been detected as NSFW')
    }
  } catch (e) {
    setFailed((<Error>e).message)
  }
}

run()
