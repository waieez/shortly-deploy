//var Bookshelf = require('bookshelf');
var path = require('path');
var mongo = require('./mongodb');
var mongoose = require('mongoose');

mongoose.connect(mongo);
module.exports = mongoose.connection;