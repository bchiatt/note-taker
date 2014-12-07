'use strict';

// var Joi  = require('joi'),
var Note = require('../../../models/note');

module.exports = {
  description: 'Create a New Note',
  tags:['notes'],
  payload: {
    output: 'stream',
    maxBytes: 300000000,
    parse: true,
    allow: 'multipart/form-data'
  },
  // validate: {
    // payload: {
      // title: Joi.string().min(1).max(255).required(),
      // body: Joi.string().min(1).required(),
      // tags: Joi.string()
    // }
  // },
  handler: function(request, reply){
    Note.create(request.auth.credentials.id, request.payload, function(result){
      reply().code(result ? 200 : 400);
    });
  }
};
