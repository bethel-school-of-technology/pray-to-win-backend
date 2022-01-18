//
// Dependencies
//
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
// Schema
//
const UserProfileSchema = new Schema({
  userId: { type: String },
  name: { type: String },
  created: { type: Date, default: Date.now },
  totalMoods: { type: Number, default: 0 },
  mIdCount: { type: Number, default: 0 },
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

mongoose.model("UserProfile", UserProfileSchema);

exports.schema = UserProfileSchema;
