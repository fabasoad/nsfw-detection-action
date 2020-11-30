const got = require('got');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'https://api.deepai.org/api/nsfw-detector';

module.exports = (apiKey, file) => {
  const form = new FormData();
  form.append('image', fs.createReadStream(file));

  const headers = form.getHeaders();
  headers['api-key'] = apiKey;
  return got
    .post(BASE_URL, {
      body: form,
      headers: headers,
    })
    .then(({body}) => JSON.parse(body).output.nsfw_score);
};
