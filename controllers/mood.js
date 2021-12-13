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

exports.create = async(function* (req, res) {
  const mood = new Mood(req.body);
  console.log(mood);
  try {
    yield mood.save();
    res.json(resBuild(true, "Mood Create Route works!", mood));
  } catch (err) {
    res.status(400).json(resBuild(false, "Failed to create mood.", err));
  }
});

exports.read = async(function (req, res, next) {

});

exports.update = async(function (req, res, next) {

});

exports.delete = async(function (req, res){
  
});


