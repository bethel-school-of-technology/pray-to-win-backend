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
const cfg = require("./config").config;
const setConfig = require("./config").setConfig;
let appConfig;
const terminal = require("./config/terminal");

//
// Initialize Express
//
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
  app.listen(appConfig.port);
  if (appConfig.fancyTerm == 2) terminal.initialize();
  else {
    // Standard terminal view
    //process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
    console.log(
      clc.bgMagenta("Mood") +
        clc.bgBlue("Ringer") +
        "\n" +
        clc.bgGreen("ONLINE!") +
        "\n" +
        clc.bgWhite("PORT:" + appConfig.port + "\nPRESS CTRL+C TO ESCAPE")
    );
  }
}

const mongoConnect = (url) => {
  return mongoose.connect(url, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

function startServer() {
  // Gets CONFIG and sets
  cfg.getConfig().then((config) => {
    appConfig = config;
    setConfig(config);
    mongoose.connection.on("error", console.log).once("open", listen);
    mongoConnect(config.db);
  });
}

//
// Star Server
//
startServer();
