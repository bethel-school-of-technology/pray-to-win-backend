//
// Dependencies
//
const { json } = require("body-parser");
const authController = require("../controllers/auth");
const terminal = require("./terminal");
const authGuard = require("../middlewares/authJwt");

//
// Middleware
//

//
// Routes
//
module.exports = function (app, passport) {
  //
  // Auth Routes
  //
  app.post("/auth/create", authController.create);
  app.post("/auth/login", authController.login);
  app.get("/auth/test", [authGuard.verifyToken], authController.test);

  //
  // User Profile Routes
  //

  //
  // Mood Routes
  //
};
