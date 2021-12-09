//
// Dependencies
//
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const Writeable = require("stream").Writable;
const terminal = require("./terminal");
const fancyTerminal = process.env.FANCY_TERMINAL || false;

//
// Advanced Morgan Config
//
class MorganStream extends Writeable {
  write(line) {
    let arrayLine = [line];
    terminal.updateExpressLogs(arrayLine);
  }
}

let terminalWriter = new MorganStream();

//
// Exports
//
module.exports = function (app) {
  // Express configuration

  var data = "";
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // This gets the response body
  // and outputs to fancy terminal view
  // it's useless for production
  if (fancyTerminal == 2) {
    app.use(
      logger("dev", {
        stream: terminalWriter,
      })
    );
    app.use((req, res, next) => {
      const defaultEnd = res.end;
      const chunks = [];

      terminal.updateBody(req.body);

      res.end = (...restArgs) => {
        if (restArgs[0]) {
          chunks.push(Buffer.from(restArgs[0]));
        }
        const body = Buffer.concat(chunks).toString("utf8");

        terminal.updateResBody(body);

        defaultEnd.apply(res, restArgs);
      };
      next();
    });
  } else {
    app.use(logger("dev"));
  }
};
