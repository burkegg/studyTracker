const _ = require('lodash');

let config = {
  env: process.env.NODE_ENV || 'development',
  logging: false,
  port: 3004,

  secrets: {
    githubToken: process.env.GITHUB_TOKEN,
    jwtSecret: process.env.JWT_SECRET,
  }
}

let envConfig = require('./' + config.env);

module.exports = _.merge(config, envConfig || {});