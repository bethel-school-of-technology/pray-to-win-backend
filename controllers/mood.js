//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const Mood = mongoose.model("Mood");
const resBuild = require("../shared/response").sendResponse;

exports.test = async(function (req, res, next) {
  Mood.findById();
  res.json(resBuild(true, "Mood Test Route works!"));
});

exports.create = async(function (req, res, next) {
  // This is where the create Mood Logic Goes

  res.json(resBuild(true, "Mood Create Route works!"));
});
