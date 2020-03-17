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

const FILES = new Set();

const gh = new GitHub(core.getInput('github_token'));
const args = { owner: owner.name, repo: repo.name };

async function processCommit(commit, types, extensions) {
  args.ref = commit.id;
  result = await gh.repos.getCommit(args);

  if (result && result.data) {
    const files = result.data.files;

    files
      .filter(file => types.includes(file.status))
      .map(file => file.filename)
      .filter(filename => {
        console.log('filtered2: ', filename);
        return extensions.map(e => e.toLowerCase()).includes(filename.split('.').pop().toLowerCase());
      })
      .forEach(filename => FILES.add(filename));
  }
}


module.exports = (types, extensions) => Promise.all(commits.map(c => processCommit(c, types, extensions))).then(() => {
  console.log('returned', FILES);
  return FILES;
});