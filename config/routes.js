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
const authMiddleware = require("../middlewares/auth");

//
// Routes
//
module.exports = function (app, passport) {
  //
  // Auth Routes
  //
  app.post("/auth/create", authController.create);
  app.post("/auth/login", authController.login);
  app.get("/auth/logout", [authMiddleware.verifyToken], authController.logout);
  app.get(
    "/auth/refresh",
    [authMiddleware.verifyToken],
    authController.refresh
  );
  app.get("/auth/test", [authMiddleware.verifyToken], authController.test);

  //
  // User Profile Routes
  //
  app.get("/profile/id", [authMiddleware.verifyToken], authController.test);

  //
  // Mood Routes
  //
  app.get("/mood/test", moodController.test);
  app.post("/mood/create", [authMiddleware.verifyToken], moodController.create);
  app.get("/mood/read", [authMiddleware.verifyToken], moodController.read);
  app.put("/mood/update", [authMiddleware.verifyToken], moodController.update);
  app.post("/mood/delete", [authMiddleware.verifyToken], moodController.delete);
  app.post(
    "/mood/rbd",
    [authMiddleware.verifyToken],
    moodController.readBetweenDates
  );
  app.get(
    "/mood/readAll",
    [authMiddleware.verifyToken],
    moodController.readAll
  );
};
