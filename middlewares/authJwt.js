const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = mongoose.model("User");
const secret = process.env.JWT_SECRET || "devsecret";
const resBuild = require("../shared/response").sendResponse;

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  console.log(token);
  if (!token) {
    return res.status(403).json(resBuild(false, "No Token"));
  }
  try {
    let decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    let message;
    if (err.expiredAt != undefined) message = "Expired";
    else message = "Unauthorized";
    return res.status(400).json(resBuild(false, message));
  }
};
