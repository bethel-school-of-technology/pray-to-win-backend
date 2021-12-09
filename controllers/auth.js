//
// Dependencies
//
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const User = mongoose.model("User");
var jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "devsecret";

exports.test = async(function (req, res, next) {
  res.json({ test: "Test route works" });
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

exports.login = async(function* (req, res) {
  console.log("LOGGING IN?");
  User.findOne(
    {
      username: req.body.username,
    },
    function (err, user) {
      if (err) throw err;
      console.log(user);
      if (!user) {
        res.status(401).json({ message: "No User Found" });
      } else {
        user.authenticate(req.body.password, function (err, match) {
          console.log(match);
          console.log(user);
          if (match && !err) {
            var token = jwt.sign({ id: user.id }, secret, {
              expiresIn: "1hr",
            });
            res.status(200).json({ success: true, token: token });
          } else {
            res.status(401).json({ success: "false", message: "Bad Info" });
          }
        });
      }
    }
  );
});
