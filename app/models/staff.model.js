const mongoose = require("mongoose");

const Staff = mongoose.model(
  "Staff-Registrations",
  new mongoose.Schema({
      surname: String,
      givenName: String,
      email: String,
      phoneNumber : String,
      password : String,
      gender:String,
      roles: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
      }
    ]
  })
);

module.exports = Staff;
