var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  email: String,
  password: String
  
});



var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}