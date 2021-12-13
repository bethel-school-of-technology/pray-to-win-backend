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
   userId: { type: String},
   mood: { type: Number, default: 0},
   changes: { type: Boolean, default: false},
   makeChanges: { type: Number},
   details: { type: String, default: ""}
});


//
//  Virtuals
//

//
// Validate Data 
//

MoodSchema.path('userId').validate(function(userId) {
   return userId.length
 }, "UserId require");


 MoodSchema.path("mood").validate(function (mood) {
   // basically like makeChanges
   return (mood >= -1 && mood <= 1)
 }, "Invalid Mood Value" );


 MoodSchema.path("changes").validate(function (changes) {
   return (typeof changes === "boolean")
 }, "Invalid Changes Data");


 MoodSchema.path("makeChanges").validate(function (makeChanges) {
   return (makeChanges >= 1 && makeChanges <= 7)
 }, "Invalid makeChanges Value");


 MoodSchema.path("details").validate(function (details) {
   return(details.length <= 250)
 }, "To long, must be under 250 words");



//
// Methods
//

mongoose.model("Mood", MoodSchema);
