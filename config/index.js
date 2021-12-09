// Dependencies

const development = require("./env/development");
const production = require("./env/production");

module.exports = {
  development: Object.assign({}, development),
  production: Object.assign({}, production),
}[process.env.NODE_ENV || "development"];
