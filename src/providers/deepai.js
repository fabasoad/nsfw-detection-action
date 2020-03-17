const axios = require('axios');

const BASE_URL = 'https://api.deepai.org/api/nsfw-detector';

module.exports = (apiKey, file) => {
  const data = new FormData();
  data.append('image', file);

  return axios.post(
    BASE_URL,
    data,
    {
      headers: {
        'api-key': apiKey
      }
    }
  ).then((resp) => resp['output']['nsfw_score']);
};
