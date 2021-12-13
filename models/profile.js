//
// Dependencies
//
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
// Schema
//
const ProfileSchema = new Schema({
  name: { type: String, default: "" },
  username: { type: String, default: "" },
  text: { type: String, defaul: "" },
  
});

//
//  Virtuals
//

//
// Validate Data
//

//
// Methods
//

  //
  // Passsword Hashing Function
  //
 

mongoose.model("Profile", ProfileSchema);