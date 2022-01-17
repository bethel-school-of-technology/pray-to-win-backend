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
  app.post("/mood/create", [authGuard.verifyToken], moodController.create);
  app.get("/mood/read", [authGuard.verifyToken], moodController.read)
  app.put("/mood/update", [authGuard.verifyToken], moodController.update);
  app.post("/mood/delete", [authGuard.verifyToken], moodController.delete);
  app.post("/mood/rbd", [authGuard.verifyToken], moodController.readBetweenDates)
  app.get("/mood/readAll", [authGuard.verifyToken], moodController.readAll)
  app.post("/mood/year", [authGuard.verifyToken], moodController.yearGrab)
};
