var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
console.log("Node started")
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BACKEND_URL: '"http://localhost:6001"'
  
})
