//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const Mood = mongoose.model("Mood");

exports.test = async(function (req, res, next) {
  res.json({ test: "MOOD Test route works" });
});

exports.create = async(function* (req, res) {
  const mood = new Mood(req.body);
  console.log(mood);
  try {
    yield mood.save();
    res.json({
      message: "Mood created",
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

exports.read = async(function (req, res, next) {

});

exports.update = async(function (req, res, next) {

});

exports.delete = async(function (req, res){
  
});


