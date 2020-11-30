const got = require('got');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'https://api.cloudmersive.com/image/nsfw/classify';

module.exports = (apiKey, file) => {
  const form = new FormData();
  form.append('imageFile', fs.createReadStream(file));

  const headers = form.getHeaders();
  headers['apikey'] = apiKey;
  return got
    .post(BASE_URL, {
      body: form,
      headers: headers,
    })
    .then(({body}) => JSON.parse(body).Score);
};
