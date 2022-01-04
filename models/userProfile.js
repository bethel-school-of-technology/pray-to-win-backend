//
// Dependencies
//
var mongoose = require("mongoose");
const Schema = mongoose.Schema;



//
// Schema
//
const UserProfileSchema = new Schema({
    userId: { type: String},
    color: { type: Array},
    totalMoods: { type: String, default: "" },
    moodPom: { type: Number, default: 0 },
});

//
//  Virtuals
//
UserProfileSchema.virtual("avgMood")
  .set(function (password) {
      this.avgMood = this.moodPom / this.totalMoods
  })
  .get(function () {
        let avg = this.moodPom / this.totalMoods;
        return avg
  });

//
// Validate Data
//

//
// Methods
//


mongoose.model("UserProfile", UserProfileSchema);