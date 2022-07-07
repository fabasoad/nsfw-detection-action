import { getInput, setFailed } from '@actions/core';
import LoggerFactory from './LoggerFactory';

async function run() {
  try {
    const threshold = Number(getInput('threshold'));
    const logger = LoggerFactory.create('index');
    logger.info(`Threshold: ${threshold}`);
  } catch (e) {
    setFailed((<Error>e).message);
  }
}

run();
