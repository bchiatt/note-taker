'use strict';

var Joi = require('Joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Delete a Notes',
  tags:['notes'],
  validate: {
    params: {
      id: Joi.number()
    }
  },
  handler: function(request, reply){
    Note.remove(request.params.id, function(err, result){
      reply(result);
    });
  }
};
