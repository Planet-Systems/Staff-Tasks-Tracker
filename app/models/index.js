const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.staff = require("./staff.model");
db.role = require("./role.model");

// db.ROLES = ["project-admin", "planet-admin", "pda-staff"];
db.ROLES = ["staff", "admin", "moderator"];

module.exports = db;