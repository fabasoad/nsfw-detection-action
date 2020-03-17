const core = require('@actions/core');
const getFiles = require('./github-files');

async function run() {
  const provider = core.getInput('provider');
  let getScore;
  switch (provider) {
    case 'deepai':
      getScore = require('./providers/deepai');
      break;
    default:
      core.setFailed(`${provider} is not supported`);
      return;
  }
  try {
    const files = await getFiles(core.getInput('type').split(','), core.getInput('extensions').split(','));
    
    for (const file of files) {
      const score = await getScore(core.getInput('api_key'), file);
      if (score >= core.getInput('threshold')) {
        console.table(score);
        core.setFailed(`"${file}" file with the score ${score} didn't pass the threshold condition.`);
      }
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

run();