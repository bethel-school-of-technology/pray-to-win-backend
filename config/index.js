// Dependencies

const development = require("./env/development");
const production = require("./env/production");
let appConfig;

exports.config = {
  development: Object.assign({}, development),
  production: Object.assign({}, production),
}[process.env.NODE_ENV || "development"];

exports.setConfig = function (config) {
  appConfig = config;
  return appConfig;
};

exports.getConfig = function () {
  console.log(appConfig);
  return appConfig;
};
