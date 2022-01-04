//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const Mood = mongoose.model("Mood");
const resBuild = require("../shared/response").sendResponse;
const { sendResponse } = require("../shared/response");
const moodFunc = require('../functions/moods')

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
  let reqId = req.query.id;
  Mood.findOne({ _id: reqId }, (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to read mood", err))
    } else {
      res.json(resBuild(true, "Read mood", result))
    }
  })
});

exports.update = async(function (req, res, next) {
  let reqId = req.body.id;
  let update = {};
    if(req.body.mood) update.mood = req.body.mood;
    if(req.body.changes) update.changes = req.body.changes 
    if(req.body.makeChanges) update.makeChanges = req.body.makeChanges;
    if(req.body.details) update.details = req.body.details;
  Mood.findOneAndUpdate({ _id: reqId }, update, (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to update mood", err))
    } else {
      res.json(resBuild(true, "Updated mood", result))
    }
    const opts = { new: true };
  })
});

exports.delete = async(function (req, res) {
  let reqId = req.body.id;
  Mood.findOneAndDelete({ _id: reqId }, {}, (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to delete mood", err))
    } else {
      res.json(resBuild(true, "Deleted mood", result))
    }
  })
});

//Finding the Average Mood

exports.readBetweenDates = async(function (req, res, next) {
  let userId = req.user.id
  let date1 = req.body.date1
  let date2 = req.body.date2
  Mood.find({ userId: userId, date: {$gt: date1, $lt: date2 } }, 
    (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to read mood", err))
    } else {
      let data = moodFunc.dateCheck(results);
      res.json(resBuild(true, "Here are moods between", data))
    }
  })
});