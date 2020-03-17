const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'https://www.picpurify.com/analyse/1.1';

module.exports = (apiKey, file) => {
  const form = new FormData();
  form.append('file_image', fs.createReadStream(file));
  form.append('API_KEY', apiKey);
  form.append('task', 'porn_moderation,suggestive_nudity_moderation');

  return axios
    .post(BASE_URL, form)
    .then((resp) => {
        console.log(resp.data);
        if (resp.data.status !== 'success') {
            const message = resp.data.error && resp.data.error.errorMsg
                ? resp.data.error.errorMsg : `Failed to analyze ${file}.`;
            throw new Error(message);
        }
        return resp.data.confidence_score_decision;
    });
};
