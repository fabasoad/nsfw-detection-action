require('dotenv').config();

module.exports = [{
  provider: 'cloudmersive',
  apiKey: process.env.CLOUDMERSIVE_API_KEY,
  threshold: {
    positive: 0.314,
    negative: 0.315
  }
}, {
  provider: 'deepai',
  apiKey: process.env.DEEPAI_API_KEY,
  threshold: {
    positive: 0.395,
    negative: 0.396
  }
}, {
  provider: 'picpurify',
  apiKey: process.env.PICPURIFY_API_KEY,
  threshold: {
    positive: 0.967,
    negative: 0.968
  }
}, {
  provider: 'sightengine',
  apiKey: process.env.SIGHTENGINE_API_KEY,
  threshold: {
    positive: 0.448,
    negative: 0.449
  }
}];