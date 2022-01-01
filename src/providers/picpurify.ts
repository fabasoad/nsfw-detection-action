import got from 'got';
import FormData from 'form-data';
import fs from 'fs';

const BASE_URL: string = 'https://www.picpurify.com/analyse/1.1';

export default (apiKey: string, file: string) => {
  const form = new FormData();
  form.append('file_image', fs.createReadStream(file));
  form.append('API_KEY', apiKey);
  form.append('task', 'porn_moderation,suggestive_nudity_moderation');

  return got.post(BASE_URL, {body: form})
  .then(({body}) => {
    const resp = JSON.parse(body);
    if (resp.status !== 'success') {
      const message = resp.error && resp.error.errorMsg ?
        resp.error.errorMsg : `Failed to analyze ${file}.`;
      throw new Error(message);
    }
    return resp.confidence_score_decision;
  });
};
