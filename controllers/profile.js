//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const User = mongoose.model("Profile");
const resBuild = require("../shared/response").sendResponse;

exports.test = async(function (req, res, next) {
  res.json(resBuild(true, "Proile Test Route works"));
});

exports.create = async(function* (req, res) {
  const user = new User(req.body);
  try {
    yield user.save();
    res.json(resBuild(true, "User Created Successfully!", user));
  } catch (err) {
    res.status(400).json(resBuild(false, "Error creating profile", err));
  }
});
