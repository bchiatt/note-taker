'use strict';

var Joi = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Show a Note',
  tags:['notes'],
  validate: {
    params: {
      id: Joi.number()
    }
  },
  handler: function(request, reply){
    Note.findOne(request.params.id, function(err, result){
      reply(result).code(result ? 200 : 400);
    });
  }
};
