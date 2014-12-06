'use strict';

var pg     = require('../postgres/manager'),
    path   = require('path'),
    crypto = require('crypto'),
    AWS     = require('aws-sdk'),
    async  = require('async');

function Note(){
}

Note.list = function(userId, limit, cb){
   pg.query('SELECT * FROM find_all_notes_by_user($1, $2)', [userId, limit], function(err, results){
     cb(err, results.rows);
   });
};

Note.remove = function(id, cb){
  pg.query('SELECT delete_note($1)', [id], function(err, results){
    cb(err, results.rows);
  });
};

Note.create = function(userId, obj, cb){
  obj.tags = obj.tags.toLowerCase().split(',').map(function(t){return t.trim();});

  async.map(obj.file, makePhotoUrls, function(err, photoUrls){
    async.map(photoUrls, savePhotosToS3, function(){
      var urls = photoUrls.map(function(obj){return obj.url;});
      pg.query('select add_note($1, $2, $3, $4, $5)', [userId, obj.title, obj.body, obj.tags, urls], function(err, results){
        cb();
      });
    });
  });
};

Note.listByUserId = function(id){
};

function makePhotoUrls(photo, cb){
  var ext  = path.extname(photo.hapi.filename);

  crypto.randomBytes(48, function(ex, buf){
    var token = buf.toString('hex'),
    key       = token + '.img' + ext,
    url = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + key;
    cb(null, {key:key, url:url, body:photo._data});
  });
}

function savePhotosToS3(photo, cb){
  var s3   = new AWS.S3(),
      params = {Bucket: process.env.AWS_BUCKET, Key: photo.key, Body: photo.body, ACL: 'public-read'};
  s3.putObject(params, cb);
}

module.exports = Note;
