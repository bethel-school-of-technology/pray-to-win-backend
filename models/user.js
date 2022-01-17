//
// Dependencies
//
var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const UserProfileSchema = require("./userProfile").schema;
const UserSettingsSchema = require("./userSettings").schema;

//
// Schema
//
const UserSchema = new Schema({
  email: { type: String, default: "" },
  username: { type: String, default: "" },
  hashed_password: { type: String, default: "" },
  authToken: { type: String, default: "" },
  profile: { type: UserProfileSchema, default: () => ({}) },
  settings: { type: UserSettingsSchema, default: () => ({}) },
  tokens: [{ token: { type: String }, hashed_address: { type: String } }],
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

UserSchema.virtual("activeToken")
  .set(function (active) {
    this._activeToken = { token: active.token, address: active.address };
    this.tokens.push({
      hashed_address: this.hashAddress(active.address),
      token: active.token,
    });
  })
  .get(function () {});

//
// Validate Data
//

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
  authenticate: async function (password) {
    let checkPassword = await bcrypt.compare(password, this.hashed_password);
    return checkPassword;
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

  //
  // Check Address match
  //
  authAddress: async function (tokenIndex, address) {
    let check = await bcrypt.compare(
      address,
      this.tokens[tokenIndex].hashed_address
    );
    return check;
  },

  //
  // Hash Address Function
  //
  hashAddress: function (address) {
    if (!address) return "";
    try {
      return bcrypt.hashSync(address, 10);
    } catch (err) {
      return "";
    }
  },
};

mongoose.model("User", UserSchema);
