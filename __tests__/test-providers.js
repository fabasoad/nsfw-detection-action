const stream = require('stream');
const { promisify } = require('util');
const { assert } = require('chai');
const fs = require('fs');
const got = require('got');
const itParam = require('mocha-param');
const fixture = require('./fixture');

const IMAGE_URL = 'https://images-na.ssl-images-amazon.com/images/I/91cDPlxcRiL._SL1500_.jpg';

describe('Test NSFW detection', () => {
  const pipeline = promisify(stream.pipeline);
  const filePath = 'fiR75VM78Yviy3.jpg';

  before(async () => {
    await pipeline(
      got.stream(IMAGE_URL),
      fs.createWriteStream(filePath),
    );
  });

  const scoreRetriever = async (arg, assertCondition) => {
    const getScore = require(`../src/providers/${arg.provider}`);
    const score = await getScore(arg.apiKey, filePath);
    assertCondition(score, arg.threshold);
  };

  itParam(
    '${value.provider} should detect NSFW content',
    fixture,
    async (arg) => scoreRetriever(arg, (s, t) => assert.isAbove(s, t.positive)),
  );

  itParam(
    '${value.provider} should not detect NSFW content',
    fixture,
    async (arg) => scoreRetriever(arg, (s, t) => assert.isBelow(s, t.negative)),
  );

  after(() => fs.unlinkSync(filePath));
});
