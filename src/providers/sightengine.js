const got = require('got');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'https://api.sightengine.com/1.0/check.json';

module.exports = (apiKey, file) => {
  const apiKeys = apiKey.split(',');
  const form = new FormData();
  form.append('media', fs.createReadStream(file));
  form.append('api_user', apiKeys[0]);
  form.append('api_secret', apiKeys[1]);
  form.append('models', 'nudity');

  return got
    .post(BASE_URL, { body: form })
    .then(({ body }) => {
      const resp = JSON.parse(body);
      if (resp.status !== 'success') {
        const message = resp.error && resp.error.errorMsg
          ? resp.error.errorMsg : `Failed to analyze ${file}.`;
        throw new Error(message);
      }
      return resp.nudity.raw;
    });
};
