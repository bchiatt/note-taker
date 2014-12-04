'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Create a New Note',
  tags:['notes'],
  validate: {
    payload: {
      title: Joi.string().min(3).max(255).required(),
      body: Joi.string().min(3).required(),
      tags: Joi.string()
    }
  },
  handler: function(request, reply){
    request.payload.userId = request.auth.credentials.id;
    Note.create(request.payload, function(result){
      reply().code(result ? 200 : 400);
    });
  }
};
