var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, index: { unique: true } },
  password: String
});

userSchema.methods.fetch = function(user, cb) {
  this.model('User').findOne(user, function (err, user){
    cb(err, user);
  });
};

userSchema.methods.hashPassword = function(){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set('password', hash);
    });
}

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
},

//hash password before saving
userSchema.pre('save', true, function (next, done){
  next()
  this.hashPassword().then(done);
});

var User = mongoose.model('User', userSchema);
module.exports = User;