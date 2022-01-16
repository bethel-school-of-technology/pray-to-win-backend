const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const e = require("express");
const secret = process.env.JWT_SECRET;
const User = mongoose.model("User");

generateToken = async function (user) {
  var token = await jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      id: user.id,
      username: user.username,
    },
    secret
  );

  return token;
};

getActiveToken = async function (token, address) {
  let activeToken = {
    token: token,
    address: address,
  };
  return activeToken;
};

getTokenIndex = async function (user, token) {
  let tokenIndex = user.tokens
    .map((e) => {
      return e.token;
    })
    .indexOf(token);
  return tokenIndex;
};

removeAllTokens = async function (user) {
  try {
    user.tokens = [];
    user.save();
    return true;
  } catch (err) {
    return false;
  }
};

exports.setUserToken = async function (user, address) {
  try {
    let token = await generateToken(user);
    let activeToken = await getActiveToken(token, address);

    user.activeToken = activeToken;
    user.save();

    return token;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.checkActiveToken = async function (user, token, address) {
  try {
    let tokenIndex = await getTokenIndex(user, token);
    if (tokenIndex === -1) throw "Inactive Token";

    let checkAddress = await user.authAddress(tokenIndex, address);
    if (checkAddress === false) throw "Invalid Token Origin";

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.refreshToken = async function (user, token, address) {
  try {
    let tokenIndex = await getTokenIndex(user, token);
    if (tokenIndex === -1) throw "Inactive Token";
    let newToken = await generateToken(user);
    let activeToken = await getActiveToken(newToken, address);
    user.activeToken = activeToken;
    user.tokens.splice(tokenIndex, 1);
    user.save();
    return newToken;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.removeToken = async function (user, token) {
  try {
    // Get index of token in active token array on the user
    let tokenIndex = await getTokenIndex(user, token);
    if (tokenIndex === -1) throw "Inactive Token";

    // Remove the token and save
    user.tokens.splice(tokenIndex, 1);
    user.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.removeAllTokensTrigger = async function (user, token) {};
