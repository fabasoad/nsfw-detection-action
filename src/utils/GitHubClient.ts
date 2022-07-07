import { context, getOctokit } from '@actions/github'
import { Commit, PushEvent } from '@octokit/webhooks-definitions/schema'
import LoggerFactory from './LoggerFactory'
import { Logger } from 'winston'

export class GitHubClient {
  private readonly logger: Logger = LoggerFactory.create(GitHubClient.name)

  public async getChangedFiles(
    gitHubToken: string,
    types: string[],
    extensions: string[]): Promise<Set<string>> {
    const payload = context.payload as PushEvent
    const commits: Commit[] = payload.commits.filter((c: Commit) => c.distinct)
    this.logger.info(`There are ${commits.length} commits have been done`)

    const octokit = getOctokit(gitHubToken)

    const repo = payload.repository
    const owner = repo.organization || repo.owner.name
    if (!owner) {
      throw new Error('Cannot retrieve repository owner')
    }

    const result: Set<string> = new Set<string>()
    for (const commit of commits) {
      const resp = await octokit.rest.repos.getCommit(
        { owner, repo: repo.name, ref: commit.id }
      )
      if (resp && resp.data && resp.data.files) {
        this.logger.info(`There are ${resp.data.files.length} ` +
          `files found in ${commit.id} commit`)
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
        this.logger.info(`There are ${result.size} files will be checked`)
      } else {
        this.logger.warning(
          `Cannot retrieve information by ${commit.id} commit`)
      }
    }
    return result
  }
}
