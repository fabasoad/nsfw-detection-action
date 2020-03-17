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

function isAdded(file) {
  return 'added' === file.status;
}

function isModified(file) {
  return 'modified' === file.status;
}

function isRenamed(file) {
  return 'renamed' === file.status;
}

async function processCommit(commit) {
  args.ref = commit.id;
  result = await gh.repos.getCommit(args);

  if (result && result.data) {
    const files = result.data.files;

    files.forEach(file => {
      isModified(file) && FILES.add(file.filename);
      isAdded(file) && FILES.add(file.filename);
      isRenamed(file) && FILES.add(file.filename);
    });
  }
}


module.exports = (types, extensions) => Promise.all(commits.map(c => processCommit(c, types, extensions))).then(() => FILES);