/**
This file is part of "GitHub Action: Get Changed Files" project which is
released under MIT license. See file https://github.com/lots0logs/gh-action-get-changed-files/blob/master/main.js
or go to https://github.com/lots0logs/gh-action-get-changed-files/ for full license details.
It was modified a bit to fit project needs.
**/
import {context} from '@actions/github';
import {GitHub, getOctokitOptions} from '@actions/github/lib/utils';
import core from '@actions/core';
import { enterpriseServer220Admin } from '@octokit/plugin-enterprise-server'

const commits = context.payload.commits.filter((c) => c.distinct);
const repo = context.payload.repository;
const org = repo?.organization;
const owner = org || repo?.owner;

const FILES = new Set();

const octokit = GitHub.plugin(enterpriseServer220Admin);
const gh = new octokit(getOctokitOptions(core.getInput('github_token'))).rest;

async function processCommit(commit, types, extensions) {
  const result = await gh.repos.getCommit({
    owner: owner.name,
    repo: repo?.name || '',
    ref: commit.id
  });

  if (result && result.data) {
    const files = result.data.files || [];

    files
      .filter((file) => types.includes(file.status))
      .map((file) => file.filename)
      .filter((filename) => extensions.map((e) => e.toLowerCase())
        .includes(filename?.split('.').pop()?.toLowerCase()))
      .forEach((filename) => FILES.add(filename));
  }
}

export default (types: string[], extensions: string[]) => Promise.all(commits.map(
  (c) => processCommit(c, types, extensions))).then(() => FILES);
