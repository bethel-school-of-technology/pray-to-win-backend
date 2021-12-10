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
    const mood = new Mood(req.body);
    try {
      yield mood.save();
      res.json({
        message: "Mood created",
      });
    } catch (err) {
      res.status(400).json(err);
    }
});

exports.update = async(function(req, res, next){
  
})
