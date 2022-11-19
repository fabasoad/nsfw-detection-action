import { context, getOctokit } from '@actions/github'
import { Commit } from '@octokit/webhooks-definitions/schema'
import LoggerFactory from './LoggerFactory'
import { Logger } from 'winston'
import { WebhookPayload } from '@actions/github/lib/interfaces'

export class GitHubClient {
  private readonly logger: Logger = LoggerFactory.create(GitHubClient.name)

  public async getChangedFiles(
    gitHubToken: string,
    types: string[],
    extensions: string[]): Promise<Set<string>> {
    const payload: WebhookPayload = context.payload
    const repo = context.repo.repo
    const owner = context.repo.owner

    const octokit = getOctokit(gitHubToken)
    const { data } = await octokit.rest.repos.compareCommits(
      { owner, repo, base: payload.before, head: payload.after }
    )
    console.log('data.files:', data.files)
    const count = 0;
    this.logger.info(`There ${count > 1 ? 'are' : 'is'} ${count}
      file${count > 1 ? 's' : ''} found between ${payload.before} &
      ${payload.after} commits`)
    const result = new Set<string>()
    // for (const commit of commits) {
    //   const count: number = resp.data.files.length
    //   for (const file of resp.data.files) {
    //     this.logger.debug(`File: ${file.filename}. Status: ${file.status}`)
    //     if (types.includes(file.status)) {
    //       const temp: string[] = file.filename.split('.')
    //       if (extensions.map((e: string) => e.toLowerCase())
    //         .includes(temp[temp.length - 1].toLowerCase())) {
    //         result.add(file.filename)
    //       }
    //     }
    //   }
    //   this.logger.info(`There ${result.size > 1 ? 'are' : 'is'}` +
    //     ` ${result.size} file${result.size > 1 ? 's' : ''} will be checked`)
    // }
    return result
  }
}
