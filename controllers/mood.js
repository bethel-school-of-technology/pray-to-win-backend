//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const Mood = mongoose.model("Mood");
const resBuild = require("../shared/response").sendResponse;
const { sendResponse } = require("../shared/response");
const moodFunc = require("../functions/moods");

async function updateUserMoodCount(user, value) {
  try {
    if (!user) throw "No user";
    if (value > 1 || value < -1) throw "Bad value";
    user.profile.totalMoods = user.profile.totalMoods + value;
    if (value === 1) user.profile.mIdCount++;
    let saveUser = await user.save();
    return { success: true, message: "Updated Total Mood value by " + value };
  } catch (errorMessage) {
    return { success: false, message: errorMessage };
  }
}

exports.test = async function (req, res, next) {
  let user = req.userObject;
  user.profile.totalMoods = user.profile.totalMoods + 1;
  await user.save();
  res.json(resBuild(true, "Mood Test Route works!"));
};

exports.create = async function (req, res) {
  try {
    // Checks for user object
    // from auth middleware
    if (!req.user) throw "Not signed in.";
    let userId = req.user.id;

    // Verifies Mood Data
    // Creaties moodData object
    let moodData = {};
    if (req.body.mood) moodData.mood = req.body.mood;
    if (req.body.changes) moodData.changes = req.body.changes;
    if (req.body.makeChanges) moodData.makeChanges = req.body.makeChanges;
    if (req.body.details) moodData.details = req.body.details;
    if (req.userObject.profile.mIdCount !== null)
      moodData.mId = req.userObject.profile.mIdCount;
    moodData.userId = userId;
    moodData.date = Date.now();

    // Creates mood object from mood schema
    // saves the mood
    // increments user's totalMood count in profile.
    let mood = new Mood(moodData);
    let saveMood = await mood.save();
    let didProfileUpdate = {};
    if (saveMood)
      didProfileUpdate = await updateUserMoodCount(req.userObject, 1);

    // creates response
    // based on if profile update fails or not
    let response = "Mood added.";
    didProfileUpdate.success
      ? (response += " Profile Total count updated!")
      : (response += " Profile total count failed to update.");
    res.status(200).json(resBuild(true, response, saveMood));
  } catch (errMessage) {
    // catches all errors
    // and sends angry response
    res.status(400).json(resBuild(false, errMessage));
  }
};

exports.readOne = async function (req, res, next) {
  try {
    // Checks for user object
    // from auth middleware
    if (!req.user) throw "Not signed in.";
    let userId = req.user.id;

    // Checks for id query value
    let mId = req.params.id;
    if (!mId) throw "No id in url parameter.";

    let oneMood = await Mood.find({ mId: mId, userId: userId });
    if (oneMood.length <= 0) throw "No mood found.";

    res.status(200).json(resBuild(true, "Read Mood", oneMood));
  } catch (errMessage) {
    // catches all errors
    // and sends angry response
    res.status(400).json(resBuild(false, errMessage));
  }
};

exports.readAll = async function (req, res, next) {
  try {
    // Checks for user object
    // from auth middleware
    if (!req.user) throw "Not signed in.";
    let userId = req.user.id;

    let findAllMoods = await Mood.find({ userId: userId });
    if (findAllMoods.length <= 0) throw "Failed to read moods.";

    res.status(200).json(resBuild(true, "Found moods!", findAllMoods));
  } catch (errMessage) {
    // catches all errors
    // and sends angry response
    res.status(400).json(resBuild(false, errMessage));
  }
};

exports.update = async function (req, res, next) {
  try {
    // Checks for user object
    // from auth middleware
    if (!req.user) throw "Not signed in.";
    let userId = req.user.id;

    // Check for ID in request
    let reqId = req.body.id;
    if (!reqId) throw "No id in body.";

    // Build and verify the update data
    let moodUpdate = {};
    if (req.body.mood != null) moodUpdate.mood = req.body.mood;
    if (req.body.changes) moodUpdate.changes = req.body.changes;
    if (req.body.makeChanges) moodUpdate.makeChanges = req.body.makeChanges;
    if (req.body.details) moodUpdate.details = req.body.details;

    // Updates and saves the mood data.
    let saveMood = await Mood.findOneAndUpdate(
      { _id: reqId, userId: userId },
      moodUpdate
    );
    if (!saveMood) throw "Failed to update mood.";

    res.status(200).json(resBuild(true, "Updated mood", saveMood));
  } catch (errMessage) {
    // catches all errors
    // and sends angry response
    res.status(400).json(resBuild(false, errMessage));
  }
};

exports.delete = async function (req, res) {
  try {
    // Checks for user object
    // from auth middleware
    if (!req.user) throw "Not signed in.";
    let userId = req.user.id;

    // Checks for ID in body
    let moodId = req.body.id;
    if (!moodId) throw "No Mood ID provided.";

    // Find and Delete Mood data
    let didProfileUpdate = {};
    let deleteMood = await Mood.findOneAndDelete({
      _id: moodId,
      userId: userId,
    });
    if (!deleteMood) throw "Failed to delete mood " + moodId;
    // decrease user's total mood count in their profile
    else didProfileUpdate = await updateUserMoodCount(req.userObject, -1);

    // creates response
    // based on if profile update fails or not
    let response = "Mood " + moodId + " deleted! ";
    didProfileUpdate.success
      ? (response += " Profile Total count updated!")
      : (response += " Profile total count failed to update.");

    res.status(200).json(resBuild(true, response, deleteMood));
  } catch (errMessage) {
    // catches all errors
    // and sends angry response
    res.status(400).json(resBuild(false, errMessage));
  }
};

exports.readBetweenDates = async function (req, res, next) {
  try {
    // Checks for user object
    // from auth middleware
    if (!req.user) throw "Not signed in.";
    let userId = req.user.id;

    let date1 = req.body.date1;
    let date2 = req.body.date2;
    console.log(date1 + " " + date2);
    if (!date1 || !date2) throw "Both Dates required - one is missing.";

    let findMood = await Mood.find({
      userId: userId,
      date: { $gt: date1, $lt: date2 },
    });
    if (!findMood) throw "Failed to find Mood with that query";
    console.log(findMood);
    res
      .status(200)
      .json(resBuild(false, "Here are moods between dates", findMood));
  } catch (errMessage) {
    // catches all errors
    // and sends angry response
    res.status(400).json(resBuild(false, errMessage));
  }
};

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
    if (!req.user) throw "no user";
    if (!date1) throw "no date1";
    if (typeof date1 !== "number") throw "not number";
    let yearMood = await Mood.find({
      userId: userId,
      date: { $gt: date2, $lt: date1 },
    });
    if (!yearMood) throw "failed to get year";
    let numOfDays = yearMood.length;
    for (let i = 0; i < yearMood.length; i++) {
      let changes = yearMood[i].makeChanges;
      switch (changes) {
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
    }
    let data = {
      numOfDiet,
      numOfRoutine,
      numOfExercise,
      numOfSleep,
      numOfHygiene,
      numOfSocial,
      numOfOther,
      numOfDays,
      percents: {
        diet: (numOfDiet / numOfDays) * 100,
        routine: (numOfRoutine / numOfDays) * 100,
        exercise: (numOfExercise / numOfDays) * 100,
        sleep: (numOfSleep / numOfDays) * 100,
        hygiene: (numOfHygiene / numOfDays) * 100,
        social: (numOfSocial / numOfDays) * 100,
        other: (numOfOther / numOfDays) * 100,
      },
    };
    res.status(200).json(resBuild(true, "date route works", data));
  } catch (errMessage) {
    res.status(400).json(resBuild(false, errMessage));
  }
};
