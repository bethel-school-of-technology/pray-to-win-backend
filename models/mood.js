//
// Dependencies
//
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
// Schema
//
const MoodSchema = new Schema({
   mood: { type: Number},
   changes: { type: Number},
   makeChanges: { type: Number},
   details: { type: String, default: ""}
});


//
//  Virtuals
//

//
// Validate Data
//

//
// Methods
//

mongoose.model("Mood", MoodSchema);
