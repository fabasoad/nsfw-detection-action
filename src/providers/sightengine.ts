import post from 'got';
import FormData from 'form-data';
import fs from 'fs';

const BASE_URL: string = 'https://api.sightengine.com/1.0/check.json';

export default (apiKey: string, file: string) => {
  const apiKeys = apiKey.split(',');
  const form = new FormData();
  form.append('media', fs.createReadStream(file));
  form.append('api_user', apiKeys[0]);
  form.append('api_secret', apiKeys[1]);
  form.append('models', 'nudity');

  return post(BASE_URL, {body: form})
  .then(({body}) => {
    const resp = JSON.parse(body);
    if (resp.status !== 'success') {
      throw new Error(`Failed to analyze ${file}.`);
    }
    return resp.nudity.raw;
  });
};
