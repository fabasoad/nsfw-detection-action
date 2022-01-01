import got from 'got';
import FormData from 'form-data';
import fs from 'fs';

const BASE_URL: string = 'https://api.deepai.org/api/nsfw-detector';

export default (apiKey: string, file: string) => {
  const form = new FormData();
  form.append('image', fs.createReadStream(file));

  const headers = form.getHeaders();
  headers['api-key'] = apiKey;
  return got.post(
      BASE_URL, {
        body: form,
        headers: headers,
      })
  .then(({body}) => JSON.parse(body).output.nsfw_score);
};
