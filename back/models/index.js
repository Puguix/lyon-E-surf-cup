// configuration for MongoDB database

const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.surfer = require("./surfer.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);
module.exports = db;
