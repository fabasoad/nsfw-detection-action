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

    let countFailed = 0
    let countError = 0
    for (const file of files) {
      const score: number | null = await provider.getScore(getInput('api-key'), file)
      if (score == null) {
        countFailed++
        logger.warning(`Failed to classify ${file} file.`)
        continue
      }
      const result: number = threshold - score!
      if (result < 0) {
        countError++
        logger.error(`${file} file is detected as NSFW (score is ${score})`)
      } else if (result > 0.2) {
        logger.info(`${file} is safe to be used (score is ${score})`)
      } else {
        logger.warning(
          `${file} file is close to be detected as NSFW (score is ${score})`)
      }
    }
    if (countFailed > 0 || countError > 0) {
      const messages: string[] = []
      if (countFailed > 0) {
        messages.push(`Failed to classify ${countFailed} file${countFailed > 1 ? 's' : ''}.`)
      }
      if (countError > 0) {
        messages.push(`${countError} file${countError > 1 ? 's' : ''} ha${countError > 1 ? 've' : 's'} been detected as NSFW.`)
      }
      setFailed(messages.join(' '))
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
