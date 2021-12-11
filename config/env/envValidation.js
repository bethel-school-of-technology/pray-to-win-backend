const clc = require("cli-color");

// This validates the .env data
// and makes sure required data exists
// App won't open if required data not
// supplied.
// App WILL start if mongo URL doesn't match
// regex - but will throw warning.
// Warning will be thrown if port
// is too high/low of number
// based on standard valid ports

module.exports = (config) => {
  let missing = [];
  let warnings = [];
  var dbUrlCheck = new RegExp("mongodb://[a-zA-Z]+:[0-9]+/[a-zA-Z]+");

  // Check if config has all required values
  if (!config.port) missing.push("PORT");
  if (config.port) {
    if (config.port <= 1023 || config.port >= 49151)
      warnings.push(
        "\tPORT=" +
          config.port +
          " might not be a good port to use. Out of standard range.\n\tMight cause crash...\n\tLive your best life though..."
      );
  }

  // Checks Mongo DB & if mongo URL is valid
  if (!config.db) missing.push("MONGO_URL and/or MONGO_COLLECTION");
  if (!dbUrlCheck.exec(config.db))
    warnings.push(
      "\t'" +
        config.db +
        "'\n\tmight not be a valid MongoDB URL\n\tApp will crash if it's invalid. If it doesn't crash you can ignore this..."
    );
  // Check if JWT Secret is provided
  if (!config.secret) missing.push("JWT_SECRET");
  if (warnings.length >= 1) {
    console.log(clc.bold.yellow("[---- WARNINGS -----]"));
    warnings.forEach((warning, i) => {
      console.log(clc.yellow("[" + parseInt(i + 1) + "]" + warning));
    });
  }
  if (missing.length >= 1) {
    console.log(clc.bold.bgRed("[---- CRITICAL ISSUES ----]"));
    console.log(
      clc.red(
        "You're missing critical config variables in the .env file!\n" +
          "Check .env.sample file and ensure you have all values\n" +
          "You're missing the following values:"
      )
    );
    missing.forEach((miss) => {
      console.log(clc.redBright("--- " + miss));
    });
    console.log(clc.red("Make changes to .env and restart!"));
    return false;
  } else return true;
};
