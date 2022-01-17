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
  if (!req.user)
    res
      .status(400)
      .json(resBuild(false, "User ID not found. Cannot create mood."));
  else {
    let mood = new Mood(req.body);
    mood.userId = req.user.id;
  try {
    yield mood.save();
    res.json(resBuild(true, "Mood Create Route works!", mood));
  } catch (err) {
    res.status(400).json(resBuild(false, "Failed to create mood.", err));
  }}
});

exports.read = async(function (req, res, next) {
  let reqId = req.query.id;
  if (!req.user)
    res
      .status(400)
      .json(resBuild(false, "User ID not found. Cannot create mood."));
  else {
  Mood.findOne({ _id: reqId }, (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to read mood", err))
    } else {
      res.json(resBuild(true, "Read mood", result))
    }
  })}
});

exports.readAll = async(function (req, res, next) {
  let userId = req.user.id
  Mood.find({ userId:  userId}, (err, result) => {
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
  if (!req.user)
    res
      .status(400)
      .json(resBuild(false, "User ID not found. Cannot update mood."));
    else {
    if(req.body.mood != null) update.mood = req.body.mood;
    if(req.body.changes) update.changes = req.body.changes; 
    if(req.body.makeChanges) update.makeChanges = req.body.makeChanges;
    if(req.body.details) update.details = req.body.details;
  Mood.findOneAndUpdate({ _id: reqId }, update, (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to update mood", err))
    } else {
      res.json(resBuild(true, "Updated mood", result))
    }
    const opts = { new: true };
  })}
});

exports.delete = async(function (req, res) {
  let reqId = req.body.id;
  if (!req.user)
    res
      .status(400)
      .json(resBuild(false, "User ID not found. Cannot edit mood."));
      else {
  Mood.findOneAndDelete({ _id: reqId }, {}, (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to delete mood", err))
    } else {
      res.json(resBuild(true, "Deleted mood", result))
    }
  })}
});

exports.readBetweenDates = async(function (req, res, next) {
  let userId = req.user.id
  let date1 = req.body.date1
  let date2 = req.body.date2
  if (!date1 || !date2) {
    res.json(resBuild(false, "Missing Date Data"))
  } 
  Mood.find({ userId: userId, date: {$gt: date1, $lt: date2 } }, 
    (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to Find Data Between Dates", err))
    } else {
      res.json(resBuild(true, "Here are moods between", result))
    }
  })
});

exports.yearGrab = async function (req, res, next) {
  let userId = req.user.id;
  let date1 = req.body.date1;
  let date2 = date1 - 31708800000;
  let numOfDiet = 0;
  let numOfRoutine = 0;
  let numOfExercise = 0;
  let numOfSleep = 0;
  let numOfHygiene = 0;
  let numOfSocial = 0;
  let numOfOther = 0;
  try {
  if (!req.user) throw "no user"
  if (!date1) throw "no date1"
    if (typeof date1 !== "number") throw "not number"
  let yearMood = await Mood.find({ userId: userId, date: {$gt: date2, $lt: date1}})
  if (!yearMood) throw "failed to get year"
  let numOfDays = yearMood.length
  for (let i = 0; i < yearMood.length; i++) {
    let changes = yearMood[i].makeChanges
    switch (changes){
      default: 
        console.log("bad data");
        break;
      case 1:
        numOfDiet++;
        break;
      case 2:
        numOfRoutine++;
        break;
      case 3:
        numOfExercise++;
        break;
      case 4:
        numOfSleep++;
        break;
      case 5:
        numOfHygiene++;
        break;
      case 6:
        numOfSocial++;
        break;
      case 7:
        numOfOther++;
        break;
    }
    console.log(changes)
  }
  console.log(numOfDiet + " " + numOfRoutine + " " + numOfExercise + " " + numOfSleep + " " + numOfHygiene + " " + numOfSocial + " " + numOfOther);
  let data = {
    numOfDiet,
    numOfRoutine,
    numOfExercise,
    numOfSleep,
    numOfHygiene,
    numOfSocial,
    numOfOther,
    numOfDays,
    percents:{
      diet: (numOfDiet/numOfDays)*100,
      routine:(numOfRoutine/numOfDays)*100,
      exercise: (numOfExercise/numOfDays)*100,
      sleep: (numOfSleep/numOfDays)*100,
      hygiene: (numOfHygiene/numOfDays)*100,
      social: (numOfSocial/numOfDays)*100,
      other: (numOfOther/numOfDays)*100,
    }
  };
  res.status(200).json(resBuild(true, "date route works", data))
} catch (errMessage) {
  res.status(400).json(resBuild(false, errMessage))
}
};