//
// Dependencies
//
const termkit = require("terminal-kit");
const clc = require("cli-color");
var term;
var ScreenBuffer = termkit.ScreenBuffer;
var initialized = false;

//
// Buffers
//
var viewport, termUi;
var expressLogs = [];
var expressBody,
  expressResBody,
  expressLogCount = 0;

function init() {
  termkit.getDetectedTerminal(function (error, detectedTerm) {
    if (error) {
      throw new Error("Cannot detect terminal output.");
    }

    term = detectedTerm;

    term.clear();

    viewport = new ScreenBuffer({
      dst: term,
      width: Math.min(term.width),
      height: Math.min(term.height),
      y: 1,
    });

    viewport.fill({
      attr: {
        color: 0,
        bgColor: 0,
      },
    });

    drawTerminal();
  });
  initialized = true;
}

function spacerGen(string, termWidth) {
  let spacer = "";
  let stringLength = string.length;
  for (let i = 0; i < (termWidth - stringLength) / 2; i++) {
    spacer += " ";
  }
  return spacer;
}

async function processLogs(logs) {
  if (logs.length >= 5) {
    logs.splice(0, 1);
  }
  return logs;
}

async function drawTerminal() {
  let width = term.width;
  let spacer = "";

  // Title Text
  let welcomeMessage = "Welcome - Server Online!";
  let welcomeSpacer = spacerGen(welcomeMessage, width);
  let titleSpacer = spacerGen("MoodRinger", width);

  term.clear();
  term.bgMagenta(titleSpacer + "Mood").bgBlue("Ringer" + titleSpacer)("\n");
  term.bgGreen(welcomeSpacer + welcomeMessage + welcomeSpacer);

  let environment = process.env.NODE_ENV || "DEV";
  let port = process.env.PORT || 3000;

  // TABLE OPTIONS
  let tableOptions = {
    hasBorder: false,
    contentHasMarkup: true,
    borderAttr: { color: "white" },
    textAttr: { bgColor: "green", color: "white" },
    firstRowTextAttr: { bgColor: "white", color: "black" },
    evenRowTextAttr: { bgColor: "red" },
    evenColumnTextAttr: { bgColor: "red" },
    hasBorder: true,
  };

  // APP HEADING TABLE
  let appStatusTable = [
    ["PORT", "ENVIRONMENT", "REQUEST COUNT"],
    [port, environment, expressLogCount],
  ];
  term.table(appStatusTable, tableOptions);
  term("Request Body\n");
  console.table(expressBody || "N\\a");
  term("Response Body\n");
  term(expressResBody || "N\\a");
  term("\n\n");
  // LOG TABLE
  let theLogs = await processLogs(expressLogs);
  term("EXPRESS LOGS\n");
  term.table(theLogs);
}

module.exports.updateExpressLogs = function (morganStream) {
  expressLogs.push(morganStream);
  expressLogCount++;
  if (initialized) drawTerminal();
};

module.exports.updateBody = function (bodyStream) {
  expressBody = bodyStream;
};

module.exports.updateResBody = function (bodyStream) {
  expressResBody = bodyStream;
};

module.exports.initialize = function () {
  init();
};
