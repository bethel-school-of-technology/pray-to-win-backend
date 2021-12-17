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
    }
  }
});

exports.read = async(function (req, res, next) {
  let reqId = req.query.id;
  let userId = req.user.id;
  Mood.find({ userId: userId }, (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to read mood", err));
    } else {
      res.json(resBuild(true, "Read mood", result));
    }
  });
});

// TODO: Need to validate data before updating value.
exports.update = async(function (req, res, next) {
  let reqId = req.body.id;
  let userId = req.user.id;
  let update = {};
  if (req.body.mood) update.mood = req.body.mood;
  if (req.body.changes) update.changes = req.body.changes;
  if (req.body.makeChanges) update.makeChanges = req.body.makeChanges;
  if (req.body.details) update.details = req.body.details;
  Mood.findOneAndUpdate(
    { _id: reqId, userId: userId },
    update,
    (err, result) => {
      if (err) {
        res.json(resBuild(false, "Failed to update mood - Error", err));
      } else if (!result) {
        res.json(
          resBuild(false, "Failed to update mood - Mood not found.", err)
        );
      } else {
        res.json(resBuild(true, "Updated mood", result));
      }
      const opts = { new: true };
    }
  );
});

exports.delete = async(function (req, res) {
  let reqId = req.body.id;
  let userId = req.user.id;
  Mood.findOneAndDelete({ _id: reqId, userId: userId }, {}, (err, result) => {
    if (err) {
      res.json(resBuild(false, "Failed to delete mood", err));
    } else if (!result) {
      res.json(resBuild(false, "Mood not found", null));
    } else {
      res.json(resBuild(true, "Deleted mood", result));
    }
  });
});
