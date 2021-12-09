//
// Environment Initialization
//
require("dotenv").config();

//
// Dependencies
//
var clc = require("cli-color");
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const terminal = require("./config/terminal");

//
// Initialize Express
//
const port = process.env.PORT || 3000;
const app = express();
const fancyTerminal = process.env.FANCY_TERMINAL || false;

//
// Exports
//
module.exports = app;

//
// Bootstrap Configurations
//
require("./config/models");
require("./config/express")(app);
require("./config/routes")(app);

//
// Server Fuctions
//
function listen() {
  if (app.get("env") === "test") return;
  app.listen(port);
  if (fancyTerminal == 2) terminal.initialize();
  else {
    // Standard terminal view
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
    console.log(
      clc.bgMagenta("Mood") +
        clc.bgBlue("Ringer") +
        "\n" +
        clc.bgGreen("ONLINE!") +
        "\n" +
        clc.bgWhite("PORT:" + port)
    );
  }
}

function connect() {
  mongoose.connection
    .on("error", console.log)
    .on("disconnected", connect)
    .once("open", listen);
  return mongoose.connect(config.db, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

//
// Star Server
//
connect();
