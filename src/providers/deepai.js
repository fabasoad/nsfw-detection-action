const fs = require('fs');
const request = require('request');

const BASE_URL = 'https://api.deepai.org/api/nsfw-detector';

module.exports = (apiKey, file) => request({
  method: 'POST',
  uri: BASE_URL,
  headers: {
    'api-key': apiKey
  },
  formData: {
    image: fs.createReadStream(file)
  }
});
