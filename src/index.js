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
    const failures = [];
    const files = await getFiles(core.getInput('type').split(','), core.getInput('extensions').split(','));
    for (const file of files) {
      console.log(file);
      const score = await getScore(core.getInput('api_key'), file);
      if (score >= core.getInput('threshold')) {
        failures.push({ file, score });
      }
    }
    if (failures.length > 0) {
      const formatted = failures.map(f => `${f.file} (${f.score})`).join(', ');
      core.setFailed(`The following files didn't pass the threshold condition: ${formatted}.`);
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

run();