'use strict';

var Joi = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Show all Notes',
  tags:['notes'],
  validate: {
    query: {
      limit: Joi.string(),
      offset: Joi.string()
    }
  },
  handler: function(request, reply){
    var limit  = request.query.limit || 5,
        offset = request.query.offset || 0;
    Note.list(request.auth.credentials.id, limit, offset, function(err, result){
      reply(result);
    });
  }
};
