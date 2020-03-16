/**
This file is part of "GitHub Action: Get Changed Files" which is released under MIT license.
See file https://github.com/lots0logs/gh-action-get-changed-files/blob/master/main.js or go to https://github.com/lots0logs/gh-action-get-changed-files/ for full license details.
It was modified a bit to fit project needs.
 */
const { context, GitHub } = require('@actions/github');
const core = require('@actions/core');

const commits = context.payload.commits.filter(c => c.distinct);
const repo = context.payload.repository;
const org = repo.organization;
const owner = org || repo.owner;

const gh = new GitHub(core.getInput('github_token'));
const args = { owner: owner.name, repo: repo.name };

function isAdded(file) {
  return 'added' === file.status;
}

function isModified(file) {
  return 'modified' === file.status;
}

async function processCommit(commit, types, extensions) {
  args.ref = commit.id;
  result = await gh.repos.getCommit(args);

  if (result && result.data) {
    const validators = [() => true];
    const files = result.data.files;
    if (types.includes('modified')) {
      validators.push(isModified);
    }
    if (types.includes('added')) {
      validators.push(isAdded);
    }
    
    return files
      .filter(file => extensions.map(e => e.toLowerCase()).includes(file.filename.split('.').pop().toLowerCase()))
      .filter(file => validators.every(v => v(file)));
  }
  throw new Error(`Failed to get commited files. Reason: ${result}`);
}

module.exports = (types, extensions) => Promise.all(commits.flatMap(c => processCommit(c, types, extensions)));