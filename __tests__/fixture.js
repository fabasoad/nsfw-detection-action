require('dotenv').config();

module.exports = [{
  provider: 'cloudmersive',
  apiKey: process.env.CLOUDMERSIVE_API_KEY,
  threshold: {
    positive: 0.31,
    negative: 0.32,
  },
}, {
  provider: 'deepai',
  apiKey: process.env.DEEPAI_API_KEY,
  threshold: {
    positive: 0.37,
    negative: 0.39,
  },
}, {
  provider: 'picpurify',
  apiKey: process.env.PICPURIFY_API_KEY,
  threshold: {
    positive: 0.96,
    negative: 0.97,
  },
}, {
  provider: 'sightengine',
  apiKey: process.env.SIGHTENGINE_API_USER +
    ',' + process.env.SIGHTENGINE_API_SECRET,
  threshold: {
    positive: 0.73,
    negative: 0.75,
  },
}];
