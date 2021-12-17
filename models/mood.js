//
// Dependencies
//
var mongoose = require("mongoose");
const NextGenEvents = require("nextgen-events");
const Schema = mongoose.Schema;

//
// Schema
//
const MoodSchema = new Schema({
  mood: { type: Number, required: true },
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  changes: { type: Boolean },
  makeChanges: { type: Number },
  details: { type: String, default: "" },
});

//
// Validate Data
//

MoodSchema.path("userId").validate(function (userId) {
  return userId.length;
}, "UserId require");

MoodSchema.path("mood").validate(function (mood) {
  // basically like makeChanges
  return mood >= -1 && mood <= 1;
}, "Invalid Mood Value");

MoodSchema.path("changes").validate(function (changes) {
  return typeof changes === "boolean";
}, "Invalid Changes Data");

MoodSchema.path("makeChanges").validate(function (makeChanges) {
  return makeChanges >= 1 && makeChanges <= 7;
}, "Invalid makeChanges Value");

MoodSchema.path("details").validate(function (details) {
  return details.length <= 250;
}, "To long, must be under 250 words");

mongoose.model("Mood", MoodSchema);
