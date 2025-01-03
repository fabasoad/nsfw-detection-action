import { context, getOctokit } from '@actions/github'
import { getLogger } from '../logging/LoggerFactory'
import { Logger } from 'winston'
import { WebhookPayload } from '@actions/github/lib/interfaces'
import {
  GetResponseTypeFromEndpointMethod,
  GetResponseDataTypeFromEndpointMethod
} from '@octokit/types'

export class GitHubClient {
  private readonly logger: Logger = getLogger()

  public async getChangedFiles(
    gitHubToken: string,
    types: string[],
    extensions: string[]): Promise<Set<string>> {
    const octokit = getOctokit(gitHubToken)

    type CompareCommitsResponseType = GetResponseTypeFromEndpointMethod<
      typeof octokit.rest.repos.compareCommits
    >
    type CompareCommitsResponseDataType = GetResponseDataTypeFromEndpointMethod<
      typeof octokit.rest.repos.compareCommits
    >
    const payload: WebhookPayload = context.payload
    const { repo, owner } = context.repo

    const base: string = context.eventName === 'pull_request'
      ? payload.pull_request?.base.sha
      : payload.before
    const head: string = payload.after
    const resp: CompareCommitsResponseType =
      await octokit.rest.repos.compareCommits({ owner, repo, base, head })
    const data: CompareCommitsResponseDataType = resp.data
    if (!data.files) {
      throw new Error('Cannot retrieve files list')
    }
    const count = data.files.length
    this.logger.info(`There ${count > 1 ? 'are' : 'is'} ${count} ` +
      `file${count > 1 ? 's' : ''} found between base (${base.substring(0, 7)})` +
      ` and head (${head.substring(0, 7)})`)
    const result = new Set<string>()
    for (const file of data.files) {
      this.logger.info(`File: ${file.filename}. Status: ${file.status}`)
      if (types.includes(file.status)) {
        const temp: string[] = file.filename.split('.')
        if (extensions.map((e: string) => e.toLowerCase())
          .includes(temp[temp.length - 1].toLowerCase())) {
          result.add(file.filename)
        }
      }
    }
    this.logger.info(`${result.size} file${result.size === 1 ? '' : 's'} will be checked`)
    return result
  }
}
