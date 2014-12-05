'use strict';

var Joi = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Show all Notes',
  tags:['notes'],
  validate: {
    query: {
      limit: Joi.string()
    }
  },
  handler: function(request, reply){
    Note.list(request.auth.credentials.id, request.params.limit || 10, function(err, result){
      reply(result);
    });
  }
};
