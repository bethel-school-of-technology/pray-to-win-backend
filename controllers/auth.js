//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const User = mongoose.model("User");
var jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const config = require("../config").getConfig;
const resBuild = require("../shared/response").sendResponse;
const af = require("../functions/auth"); // Auth Functions

exports.test = async(function (req, res, next) {
  res.json(resBuild(true, "Test Route Works!"));
});

exports.create = async(function* (req, res) {
  const user = new User(req.body);
  try {
    yield user.save();
    res.json(resBuild(true, "User Created!", { username: user.username }));
  } catch (err) {
    res.status(400).json(resBuild(false, "User Creation Error", err));
  }
});

exports.login = async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  try {
    // Check for all required data
    if (!username || !password) throw "Please provide all data for request";

    // Check if the user exists in the db
    let user = await User.findOne({ username: username });
    if (!user) throw "No User Found";

    // Check if Users Password is correct
    let checkPassword = await user.authenticate(password);
    if (checkPassword === false) throw "Bad User Information";

    // Generate Token
    let token = await af.setUserToken(user, req.socket.remoteAddress);
    if (token === false) throw "Failed to make token";

    // Send Response
    res.status(200).json(resBuild(true, "Successfully Logged in!", { token }));
  } catch (err) {
    res.status(401).json(resBuild(false, err));
  }
};

exports.refresh = async function (req, res) {
  let token = req.headers["x-access-token"];
  let address = req.socket.remoteAddress;
  try {
    if (!req.user || !token) throw "No user or token data";
    let user = await User.findOne({ username: req.user.username });
    if (!user) throw "User not found. Can't refresh";

    // Generate new token and delete old one.
    let newToken = await af.refreshToken(user, token, address);
    if (newToken === false) throw "Failed to refresh token";

    res
      .status(200)
      .json(resBuild(true, "Token Refreshed!", { token: newToken }));
  } catch (errMessage) {
    res.status(401).json(resBuild(false, errMessage));
  }
};

exports.logout = async function (req, res) {
  let token = req.headers["x-access-token"];
  try {
    let user = await User.findOne({ username: req.user.username });
    if (!user) throw "User not found. Can't logout";

    let killToken = await af.removeToken(user, token);
    if (killToken === false) throw "Failed to remove token & logout";

    res.status(200).json(resBuild(true, "Successfully logged out!"));
  } catch (errMessage) {
    res.status(401).json(resBuild(false, errMessage));
  }
};
