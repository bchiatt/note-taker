'use strict';

var Joi = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Show all Notes',
  tags:['notes'],
  validate: {
    query: {
      limit: Joi.string(),
      offset: Joi.string(),
      tag: Joi.string()
    }
  },
  handler: function(request, reply){
    var limit  = request.query.limit,
        offset = request.query.offset,
        tag    = request.query.tag;

    Note.list(request.auth.credentials.id, limit, offset, tag, function(err, result){
      reply(result);
    });
  }
};
