const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const secret = process.env.JWT_SECRET || "devsecret";
const resBuild = require("../shared/response").sendResponse;
const af = require("../functions/auth");

exports.verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  let address = req.socket.remoteAddress;
  try {
    // Check if token attached to header
    if (!token) throw "No Token.";

    // Check if token is expired
    let decoded = await jwt.verify(token, secret);
    if (decoded.expiredAt) throw "Token Expired.";

    // Check username from provided token
    let user = await User.findOne({ username: decoded.username });
    if (!user) throw "Bad token data.";

    // Check if token is active & origin
    let isTokenActive = await af.checkActiveToken(user, token, address);
    if (isTokenActive === false) throw "Inactive token.";

    // Attached decoded info to req.user object
    req.user = decoded;
    req.profile = user.profile;
    req.settings = user.settings;
    next();
  } catch (errMessage) {
    if (!errMessage) errMessage = "Default error.";
    if (errMessage.expiredAt) errMessage = "Token Expired";
    return res.status(400).json(resBuild(false, errMessage));
  }
};
