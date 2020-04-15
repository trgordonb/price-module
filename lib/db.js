const mongoose = require('mongoose');
const logger = require('./logger');
const uri = "mongodb+srv://trgordonb:ensemble@cluster0-lvdi2.azure.mongodb.net/tokenadmin?retryWrites=true&w=majority";
let mongoDB = process.env.MONGODB_URI || uri;
mongoose.connect(mongoDB,{useNewUrlParser: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('err',err=>logger.error('MongoDB Connection Fail :',err));

module.exports = db;
