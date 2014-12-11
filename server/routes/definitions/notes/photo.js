'use strict';

var //Joi  = require('joi');
    Note = require('../../../models/note');

module.exports = {
  description: 'Add Photo to Note',
  tags:['notes', 'photos'],
  payload: {
    maxBytes: 300000000
  },
  // validate: {
  //   payload: {
  //     buf: Joi.string()
  //   },
  //   params: {
  //     id: Joi.number()
  //   }
  // },
  handler: function(request, reply){
    Note.addPhoto(request.params.id, request.payload.buf, function(err){
      console.log('error in handler at end', err);
      reply().code(!err ? 200 : 400);
    });
  }
};
