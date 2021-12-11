const port = process.env.PORT;
const dbCollection = process.env.MONGODB_COLLECTION;
const mongourl = process.env.MONGODB_URL;
const jwtSecret = process.env.JWT_SECRET;
const fancyTerm = 1;

module.exports = () => {
  let config = {
    db: mongourl + dbCollection,
    port: port,
    secret: jwtSecret,
    fancyTerm: fancyTerm,
  };

  return config;
};
