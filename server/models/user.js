'use strict';

var request = require('request'),
    crypto  = require('crypto'),
    bcrypt  = require('bcrypt'),
    path    = require('path'),
    AWS     = require('aws-sdk'),
    pg      = require('../postgres/manager');

function User(obj){
  this.username = obj.username;
}

User.register = function(obj, cb){
  var user = new User(obj);

  makeAvatarUrl(obj.avatar, function(err, avatar){
    user.password = bcrypt.hashSync(obj.password, 10);
    pg.query('insert into users (username, password, avatar) values ($1, $2, $3) returning id', [user.username, user.password, avatar.url], function(err, results){
      if(err){return cb(err);}
      // insert createUserBucker(id, cb) here
      download(obj.avatar, avatar.file, cb);
    });
  });
};

User.login = function(obj, cb){
  pg.query('select * from users where username = $1 limit 1', [obj.username], function(err, results){
    var user = results.rows[0];
    if(!user){return cb();}

    var isAuth = bcrypt.compareSync(obj.password, user.password);
    if(!isAuth){return cb();}

    delete user.password;
    cb(user);
  });
};

function makeAvatarUrl(url, cb){
  var ext  = path.extname(url);

  crypto.randomBytes(48, function(ex, buf){
    var token = buf.toString('hex'),
        file = token + '.avatar' + ext,
        avatar = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + file;
    cb(null, {file:file, url:avatar});
  });
}

// function createUserBucket(id, cb){
//
// }

function download(url, file, cb){
  var s3   = new AWS.S3();

  request({url: url, encoding: null}, function(err, response, body){
    var params = {Bucket: process.env.AWS_BUCKET, Key: file, Body: body, ACL: 'public-read'};
    s3.putObject(params, cb);
  });
}

module.exports = User;
