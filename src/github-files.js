/**
This file is part of "GitHub Action: Get Changed Files" project which is released under MIT license.
See file https://github.com/lots0logs/gh-action-get-changed-files/blob/master/main.js or go to https://github.com/lots0logs/gh-action-get-changed-files/ for full license details.
It was modified a bit to fit project needs.
**/
const { context, GitHub } = require('@actions/github');
const core = require('@actions/core');

const commits = context.payload.commits.filter(c => c.distinct);
const repo = context.payload.repository;
const org = repo.organization;
const owner = org || repo.owner;

const gh = new GitHub(core.getInput('github_token'));
const args = { owner: owner.name, repo: repo.name };

async function processCommit(commit, types, extensions) {
  args.ref = commit.id;
  const result = await gh.repos.getCommit(args);

  if (result && result.data) {
    const files = result.data.files;
    console.log('FILES: ');
    console.log(files);
    
    console.table(extensions);
    console.table(extensions.map(e => e.toLowerCase()));
    console.table(files.map(file => file.filename.split('').pop().toLowerCase()));
    const result = files
      .filter(file => types.includes(file.status))
      .filter(file => extensions.map(e => e.toLowerCase()).includes(file.filename.split('.').pop().toLowerCase()));
    console.log(result);
    return result;
  }
  throw new Error(`Failed to get commited files. Reason: ${result}`);
}

module.exports = (types, extensions) => Promise.all(commits.map(c => processCommit(c, types, extensions)).filter(c => c.length > 0));