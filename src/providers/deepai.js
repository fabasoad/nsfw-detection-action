const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'https://api.deepai.org/api/nsfw-detector';

module.exports = (apiKey, file) => {
  const data = new FormData();
  data.append('image', fs.createReadStream(file));

  return axios.post(
    BASE_URL,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'api-key': apiKey
      }
    }
  ).then((resp) => resp['output']['nsfw_score']);
};
