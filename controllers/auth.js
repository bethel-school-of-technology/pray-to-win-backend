//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const User = mongoose.model("User");
var jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const config = require("../config").getConfig;
const resBuild = require("../shared/response").sendResponse;

exports.test = async(function (req, res, next) {
  res.json({ test: "Test route works" });
});

exports.create = async(function* (req, res) {
  const user = new User(req.body);
  try {
    yield user.save();
    res.json(resBuild(true, "User Created!", { username: user.username }));
  } catch (err) {
    res.status(400).json(err);
  }
});

exports.login = async(function* (req, res) {
  User.findOne(
    {
      username: req.body.username,
    },
    function (err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).json(resBuild(false, "User Not Found", null));
      } else {
        user.authenticate(req.body.password, async function (err, match) {
          if (match && !err) {
            var token = await jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                id: user.id,
                username: user.username,
              },
              secret
            );
            res
              .status(200)
              .json(resBuild(true, "Successfully Logged in!", { token }));
          } else {
            res.status(401).json({ success: "false", message: "Bad Info" });
          }
        });
      }
    }
  );
});
