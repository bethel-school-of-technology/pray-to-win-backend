const port = process.env.PORT || 3000;
const dbCollection = process.env.MONGODB_COLLECTION || "prayToWin";
const mongourl = process.env.MONGODB_URL || "mongodb://localhost:27017/";

module.exports = {
  db: mongourl + dbCollection,
  port: port,
};
