import core from '@actions/core';
import getFiles from './github-files';

async function run() {
  const provider = core.getInput('provider');
  let getScore;
  switch (provider) {
  case 'cloudmersive':
    getScore = require('./providers/cloudmersive');
    break;
  case 'deepai':
    getScore = require('./providers/deepai');
    break;
  case 'picpurify':
    getScore = require('./providers/picpurify');
    break;
  case 'sightengine':
    getScore = require('./providers/sightengine');
    break;
  default:
    core.setFailed(`${provider} is not supported`);
    return;
  }
  try {
    const files = await getFiles(
        core.getInput('type').split(','),
        core.getInput('extensions').split(','));

    for (const file of files) {
      const score = await getScore(core.getInput('api_key'), file);
      const threshold = core.getInput('threshold');
      if (score >= threshold) {
        core.setFailed(`"${file}" file has been detected as NSFW content. ` +
          `Condition: ${score} >= ${threshold}.`);
      }
    }
  } catch (e) {
    core.setFailed((<Error>e).message);
  }
}

run();
