import { getInput, setFailed } from '@actions/core'
import { Logger } from 'winston'
import {
  INsfwDetectionProvider,
  NsfwDetectionProviderFactory
} from './detection/NsfwDetectionProviderFactory'
import { GitHubClient } from './utils/GitHubClient'
import { getLogger } from './utils/LoggerFactory'

type RunOptions = {
  threshold: number,
  providerName: string,
  githubToken: string,
  types: string[],
  extensions: string[]
}

async function run({ threshold, providerName, githubToken, types, extensions }: RunOptions) {
  const logger: Logger = getLogger()
  try {
    const provider: INsfwDetectionProvider =
        NsfwDetectionProviderFactory.getProvider(providerName)
    const githubClient = new GitHubClient()
    const files: Set<string> = await githubClient.getChangedFiles(
      githubToken,
      types,
      extensions
    )

    let count = 0
    for (const file of files) {
      const score: number = await provider.getScore(getInput('api-key'), file)
      const result: number = threshold - score
      if (result < 0) {
        count++
        logger.error(`${file} file is detected as NSFW (score is ${score})`)
      } else if (result > 5) {
        logger.info(`${file} is safe to be used (score is ${score})`)
      } else {
        logger.warning(
          `${file} file is close to be detected as NSFW (score is ${score})`)
      }
    }
    if (count > 0) {
      setFailed(`${count} file${count > 1 ? 's' : ''} ` +
        `ha${count > 1 ? 've' : 's'} been detected as NSFW.`)
    }
  } catch (e) {
    setFailed((<Error>e).message)
  }
}

run({
  threshold: Number(getInput('threshold')),
  providerName: getInput('provider'),
  githubToken: getInput('github-token'),
  types: getInput('types').split(','),
  extensions: getInput('extensions').split(',')
})
