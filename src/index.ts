import { getInput, setFailed, error, warning, info } from '@actions/core'
import {
  NsfwDetectionProviderFactory
} from './translation/NsfwDetectionProviderFactory'
import { GitHubUtils } from './utils/GitHubUtils'

async function run() {
  try {
    const threshold = Number(getInput('threshold'))
    const provider =
        NsfwDetectionProviderFactory.getProvider(getInput('provider'))
    const files: Set<string> = await GitHubUtils.getChangedFiles(
      getInput('github_token'),
      getInput('type').split(','),
      getInput('extensions').split(',')
    )

    let count = 0
    for (const file of files) {
      const score: number = await provider.getScore(getInput('api_key'), file)
      const result: number = threshold - score
      const output = `Score: ${score}, File: ${file}`
      if (result < 0) {
        count++
        error(`[ERROR  ] File is detected as NSFW. ${output}`)
      } else if (result > 5) {
        info(`[INFO   ] File is safe to be used. ${output}`)
      } else {
        warning(`[WARNING] File is closed to be detected as NSFW. ${output}`)
      }
    }
    if (count > 0) {
      setFailed(`\nThere are ${count} files have been detected as NSFW`)
    }
  } catch (e) {
    setFailed((<Error>e).message)
  }
}

run()
