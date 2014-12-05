'use strict';

var pg    = require('../postgres/manager'),
    async = require('async');

function Note(){
}

// alternative method using pseql query
/*
Note.create = function(user, obj, cb){
  pg.query('select add_note($1, $2, $3, $4)', [user.id, obj.title, obj.body, obj.tags], function(err, results){
    console.log(err, results);
    cb();
  });
};
*/

Note.list = function(userId, limit, cb){
   pg.query('SELECT * FROM find_all_notes_by_user($1, $2)', [userId, limit], function(err, results){
     cb(err, results.rows);
   });
};

Note.create = function(obj, cb){
  pg.query('insert into notes (title, body, userId) values ($1, $2, $3) returning id', [obj.title, obj.body, obj.userId], function(err, results){
    if(err || !results.rowCount){return cb();}
    var noteId = results.rows[0].id,
        tags   = obj.tags.toLowerCase().split(',').map(function(t){return t.trim();});

    async.map(tags, findTags, function(err, tagIds){
      tagIds.unshift(noteId);
      var sql = makeJoinTableString(tagIds);

      pg.query(sql, tagIds, function(err, results){
        if(err){cb();}
        cb(results);
      });
    });
  });
};

Note.listByUserId = function(id){

};

function findTags(tag, callback){
  var param = [];
  param.push(tag);
  pg.query('select * from tags where name like $1 limit 1', param, function(err, result){
    if(result.rowCount){
      callback(null, result.rows[0].id);
    }else{
      pg.query('insert into tags (name) values ($1) returning id', param, function(err, result){
        callback(null, result.rows[0].id);
      });
    }
  });
}

function makeJoinTableString(ids){
  var string = 'insert into notes_tags (note_id, tag_id) values ';

  for(var i = 1; i < ids.length; i++){
    string = string + '($1, $' + (i + 1) + ')';
    if(i === ids.length - 1){return string;}

    string = string + ', ';
  }
}

module.exports = Note;
