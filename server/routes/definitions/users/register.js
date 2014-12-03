'use strict';

var Joi  = require('joi'),
    User = require('../../../models/user');

module.exports = {
  description: 'Register a User',
  tags:['users'],
  validate: {
    payload: {
      username: Joi.string().min(3).max(12).required(),
      password: Joi.string().min(3).required(),
      avatar: Joi.string().required()
    }
  },
  auth: {
    mode: 'try'
  },
  handler: function(request, reply){
    User.register(request.payload, function(err, results){
      console.log('error in controller', err);
      console.log('results in controller', results);
      reply();
    });
  }
};
