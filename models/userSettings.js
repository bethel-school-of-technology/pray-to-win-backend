//
// Dependencies
//
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
// Schema
//
const UserSettingsSchema = new Schema({
  userId: { type: String },
  color: { type: Array },
  totalMoods: { type: String, default: "" },
  moodPom: { type: Number, default: 0 },
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

mongoose.model("UserSettings", UserSettingsSchema);

exports.schema = UserSettingsSchema;
