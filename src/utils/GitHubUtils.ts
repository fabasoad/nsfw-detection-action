import { context, getOctokit } from '@actions/github';
import { Commit, PushEvent } from '@octokit/webhooks-definitions/schema';

export class GitHubUtils {
  public static async getChangedFiles(
    gitHubToken: string,
    types: string[],
    extensions: string[]): Promise<Set<string>> {
    const payload = context.payload as PushEvent;
    const commits: Commit[] = payload.commits.filter((c: Commit) => c.distinct);

    const octokit = getOctokit(gitHubToken);

    const repo = payload.repository;
    const owner = repo.organization || repo.owner.name;
    if (!owner) {
      throw new Error('Cannot retrieve repository owner');
    }

    const result: Set<string> = new Set<string>();
    for (const commit of commits) {
      const resp = await octokit.rest.repos.getCommit(
        { owner, repo: repo.name, ref: commit.id }
      );
      if (resp && resp.data) {
        resp.data.files
          ?.filter((file) => types.includes(file.status))
          .map((file) => file.filename)
          .filter((filename: string) => {
            const temp: string[] = filename.split('.');
            return extensions.map((e: string) => e.toLowerCase())
              .includes(temp[temp.length - 1].toLowerCase())
          })
          .forEach((filename) => result.add(filename));
      }
    }
    return result;
  }
}
