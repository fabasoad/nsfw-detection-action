const BASE_URL = 'https://api.deepai.org/api/nsfw-detector';
module.exports = (apiKey, file) => fetch(BASE_URL, {
  method: 'POST',
  headers: {
    'api-key': apiKey
  },
  body: file
}).then(resp => resp.json()['output']['nsfw_score']);
