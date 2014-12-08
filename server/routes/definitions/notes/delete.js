'use strict';

var Joi = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Delete a Note',
  tags:['notes'],
  validate: {
    params: {
      id: Joi.number()
    }
  },
  handler: function(request, reply){
    Note.remove(request.params.id, function(err){
      reply().code(err ? 400 : 200);
    });
  }
};
