const envValidation = require("./envValidation");

async function getConfig() {
  return new Promise((resolve, reject) => {
    const port = process.env.PORT;
    const dbCollection = process.env.MONGODB_COLLECTION;
    const mongourl = process.env.MONGODB_URL;
    const jwtSecret = process.env.JWT_SECRET;
    const fancyTerm = process.env.FANCY_TERMINAL || 1;
    let config = {
      db: mongourl + dbCollection,
      port: port,
      secret: jwtSecret,
      fancyTerm: fancyTerm,
    };
    let checkConfig = envValidation(config);
    if (checkConfig) return resolve(config);
    else {
      process.exit();
    }
  });
}

module.exports.getConfig = getConfig;
