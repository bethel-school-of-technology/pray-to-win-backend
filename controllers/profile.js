//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const User = mongoose.model("Profile");

exports.test = async(function (req, res, next) {
  res.json({ test: "Profile route works" });
});

exports.create = async(function* (req, res) {
  const user = new User(req.body);
  try {
    yield user.save();
    res.json({
      message: "User Successfully created!",
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

