//
// Dependencies
//
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
// Schema
//
const UserSchema = new Schema({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  username: { type: String, default: "" },
  hashed_password: { type: String, default: "" },
  authToken: { type: String, default: "" },
});

//
//  Virtuals
//
UserSchema.virtual("password")
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
UserSchema.path("name").validate(function (name) {
  return name.length;
}, "Name required");

UserSchema.path("email").validate(function (email) {
  return email.length;
}, "Email required");

UserSchema.path("email").validate(function (email) {
  return new Promise((resolve) => {
    const User = mongoose.model("User");
    if (this.isNew || this.isModified("email")) {
      User.find({ email }).exec((err, users) => resolve(!err && !users.length));
    } else {
      resolve(true);
    }
  });
});

UserSchema.path("username").validate(function (username) {
  return username.length;
}, "Username required");

UserSchema.path("hashed_password").validate(function (hashed_password) {
  return hashed_password.length;
}, "Password required");

//
// Methods
//
UserSchema.methods = {
  //
  // Check Password match
  //
  authenticate: function (password, callback) {
    // THIS IS NOT USING HASHING YET! UPDATE THIS
    bcrypt.compare(password, this.hashed_password, function (err, match) {
      if (err) {
        return callback(err);
      }
      callback(null, match);
    });
  },

  //
  // Passsword Hashing Function
  //
  hashPassword: function (password) {
    // This is NOT hashing yet
    if (!password) return "";
    try {
      return bcrypt.hashSync(password, 10);
    } catch (err) {
      return "";
    }
  },
};

mongoose.model("User", UserSchema);
