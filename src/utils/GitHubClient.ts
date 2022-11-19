import { context, getOctokit } from '@actions/github'
import { Commit } from '@octokit/webhooks-definitions/schema'
import LoggerFactory from './LoggerFactory'
import { Logger } from 'winston'
import {WebhookPayload} from '@actions/github/lib/interfaces';

export class GitHubClient {
  private readonly logger: Logger = LoggerFactory.create(GitHubClient.name)

  public async getChangedFiles(
    gitHubToken: string,
    types: string[],
    extensions: string[]): Promise<Set<string>> {
    const payload: WebhookPayload = context.payload
    console.log('Context', context)
    const commits: Commit[] = payload.commits.filter((c: Commit) => c.distinct)
    this.logger.info(`There ${commits.length > 1 ? 'are' : 'is'} ` +
      `${commits.length} commit${commits.length > 1 ? 's' : ''} ` +
      `ha${commits.length > 1 ? 've' : 's'} been done`)

    const octokit = getOctokit(gitHubToken)

    const repo = payload.repository
    const owner = repo?.organization || repo?.owner.name
    if (!owner) {
      throw new Error('Cannot retrieve repository owner')
    }

    const result = new Set<string>()
    for (const commit of commits) {
      const resp = await octokit.rest.repos.getCommit(
        { owner, repo: repo.name, ref: commit.id }
      )
      if (resp && resp.data && resp.data.files) {
        const count: number = resp.data.files.length
        this.logger.info(`There ${count > 1 ? 'are' : 'is'} ${count} ` +
          `file${count > 1 ? 's' : ''} found in ${commit.id} commit`)
        for (const file of resp.data.files) {
          this.logger.debug(`File: ${file.filename}. Status: ${file.status}`)
          if (types.includes(file.status)) {
            const temp: string[] = file.filename.split('.')
            if (extensions.map((e: string) => e.toLowerCase())
              .includes(temp[temp.length - 1].toLowerCase())) {
              result.add(file.filename)
            }
          }
        }
        this.logger.info(`There ${result.size > 1 ? 'are' : 'is'}` +
          ` ${result.size} file${result.size > 1 ? 's' : ''} will be checked`)
      } else {
        this.logger.warning(
          `Cannot retrieve information by ${commit.id} commit`)
      }
    }
    return result
  }
}
