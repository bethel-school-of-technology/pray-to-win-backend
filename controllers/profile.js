//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const User = mongoose.model("User");
const resBuild = require("../shared/response").sendResponse;

exports.test = async(function (req, res, next) {
  res.json(resBuild(true, "Test Route Works!"));
});

exports.getProfile = async function (req, res, next) {
  let user = req.user;
  let profile = req.profile;
  try {
    // Validates that the data exists from middleware
    if (!user || !profile) throw "Bad Data - can't load profile";

    // Validates that profile and user have matching ID values
    if (user.id != profile.userId) throw "Data mismatch - can't load profile";

    res.status(200).json(resBuild(true, profile));
  } catch (errMessage) {
    res.status(401).json(resBuild(false, errMessage));
  }
};

exports.updateProfile = async function (req, res, next) {};
