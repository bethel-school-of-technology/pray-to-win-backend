//
// Dependencies
//

//
//  Controllers
//
const authController = require("../controllers/auth");
const moodController = require("../controllers/mood");

//
// Middleware
//
const authGuard = require("../middlewares/authJwt");

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
  app.get("/profile/id", authController.test);
  /* -- this route is set to the wrong thing
        I changed it to test to fix bugs
  */

  //
  // Mood Routes
  //
  app.get("/mood/test", moodController.test);
  app.get("/mood/create", moodController.create);
  app.post("/mood/update", moodController.update);
};
