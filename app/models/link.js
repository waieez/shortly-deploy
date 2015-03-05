var db = require('../config');
var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var linkSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

linkSchema.methods.shortlify = function(done){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
  done();
}

linkSchema.methods.fetch = function(link, cb) {
  this.model('Link').findOne(link, function (err, result){
    cb(err, result);
  });
};

//hash link before saving
linkSchema.pre('save', true, function (next, done){
  next()
  this.shortlify(done)
});

var Link = mongoose.model('Link', linkSchema);
module.exports = Link;