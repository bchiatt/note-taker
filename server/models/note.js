'use strict';

var pg     = require('../postgres/manager'),
    path   = require('path'),
    crypto = require('crypto'),
    AWS     = require('aws-sdk'),
    async  = require('async');

function Note(){
}

Note.list = function(userId, limit, offset, tag, cb){
   pg.query('SELECT * FROM find_all_notes_by_user($1, $2, $3, $4)', [userId, limit, offset, tag], function(err, results){
     cb(err, (results && results.rows ? results.rows : null));
   });
};

Note.findOne = function(noteId, cb){
  pg.query('SELECT * FROM find_note_by_id($1)', [noteId], function(err, results){
    results = (results && results.rows ? results.rows[0] : null);
    cb(err, results);
  });
};

Note.remove = function(id, cb){
  pg.query('SELECT array_agg(url) as urls FROM photos WHERE note_id = $1', [id], function(err, results){
    console.log('results', results);
    var photos = (results.rows[0].urls === null ? null : results.rows[0].urls.map(makePhotoDeleteObj));
    pg.query('SELECT delete_note($1)', [id], function(err, results){
      if(photos === null){return cb();}
      var s3 = new AWS.S3(),
          params = {
            Bucket: process.env.AWS_BUCKET,
            Delete: {
              Objects: photos
            }
          };

      s3.deleteObjects(params, cb);
    });
  });
};

Note.create = function(userId, obj, cb){
  obj.tags = obj.tags.toLowerCase().split(',').map(function(t){return t.trim();});
  obj.file = obj.file || [];
  obj.file = (obj.file[0] ? obj.file : [obj.file]);

  async.map(obj.file, makePhotoUrls, function(err, photoUrls){
    var urls = (photoUrls[0] === null ? [] : photoUrls.map(function(obj){return obj.url;}));
    pg.query('select add_note($1, $2, $3, $4, $5)', [userId, obj.title, obj.body, obj.tags, urls], function(err, results){
      async.map(photoUrls, savePhotoToS3, function(){
        cb();
      });
    });
  });
};

Note.addPhoto = function(noteId, b64string, cb){
  crypto.randomBytes(48, function(ex, buf){
    var body = new Buffer(b64string, 'base64'),
    token    = buf.toString('hex'),
    key      = token + '.img.png',
    url      = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + key;
    pg.query('insert into photos(note_id, url) values ($1, $2)', [noteId, url], function(err, response){
      savePhotoToS3({key:key, body:body}, cb);
    });
  });
};

Note.listByUserId = function(id){
};

function makePhotoDeleteObj(photo){
  var key = photo.match(/bc-note-taker\/([^']*)/)[1];

  return {Key: key};
}

function makePhotoUrls(photo, cb){
  if(!photo._data){return cb(null, null);}
  var ext  = path.extname(photo.hapi.filename);

  crypto.randomBytes(48, function(ex, buf){
    var token = buf.toString('hex'),
    key       = token + '.img' + ext,
    url = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + key;
    cb(null, {key:key, url:url, body:photo._data});
  });
}

function savePhotoToS3(photo, cb){
  if(photo === null){return cb();}
  var s3   = new AWS.S3(),
      params = {Bucket: process.env.AWS_BUCKET, Key: photo.key, Body: photo.body, ACL: 'public-read'};
  s3.putObject(params, cb);
}

module.exports = Note;
