const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'https://api.deepai.org/api/nsfw-detector';

module.exports = (apiKey, file) => {
  const form = new FormData();
  form.append('image', fs.createReadStream(file));

  const headers = form.getHeaders();
  headers['api-key'] = apiKey;
  return axios
    .create({ headers: headers })
    .post(BASE_URL, form)
    .then((resp) => resp['output']['nsfw_score']);
};
