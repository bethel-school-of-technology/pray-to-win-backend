//
// Dependencies
//
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
// Schema
//
const MoodSchema = new Schema({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  username: { type: String, default: "" },
  hashed_password: { type: String, default: "" },
  authToken: { type: String, default: "" },
});

//
//  Virtuals
//
MoodSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.hashed_password = this.hashPassword(password);
  })
  .get(function () {
    return this._password;
  });

//
// Validate Data
//
MoodSchema.path("name").validate(function (name) {
  return name.length;
}, "Name required");

MoodSchema.path("email").validate(function (email) {
  return email.length;
}, "Email required");

MoodSchema.path("email").validate(function (email) {
  return new Promise((resolve) => {
    const User = mongoose.model("User");
    if (this.isNew || this.isModified("email")) {
      User.find({ email }).exec((err, users) => resolve(!err && !users.length));
    } else {
      resolve(true);
    }
  });
});

MoodSchema.path("username").validate(function (username) {
  return username.length;
}, "Username required");

MoodSchema.path("hashed_password").validate(function (hashed_password) {
  return hashed_password.length;
}, "Password required");

//
// Methods
//
MoodSchema.methods = {
  //
  // Check Password match
  //
  test: function (inputValue, callback) {
    let modifyValue = inputValue + " is modified";
    return modifyValue;
  },
};

mongoose.model("Mood", MoodSchema);
