//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const Mood = mongoose.model("Mood");

exports.test = async(function (req, res, next) {
  Mood.findById();
  res.json({ test: "MOOD Test route works" });
});

exports.create = async(function (req, res, next) {
  // This is where the create Mood Logic Goes

  res.json({ mood: "mood was created!" });
});
