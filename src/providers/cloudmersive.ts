import got from 'got';
import FormData from 'form-data';
import fs from 'fs';

const BASE_URL: string = 'https://api.cloudmersive.com/image/nsfw/classify';

export default (apiKey: string, file: string) => {
  const form = new FormData();
  form.append('imageFile', fs.createReadStream(file));

  const headers = form.getHeaders();
  headers['apikey'] = apiKey;
  return got.post(
      BASE_URL, {
        body: form,
        headers: headers
      })
  .then(({body}) => JSON.parse(body).Score);
};
