'use strict';

module.exports = [
  {method: 'get',    path: '/{param*}',   config: require('../definitions/general/static')},
  {method: 'post',   path: '/register',   config: require('../definitions/users/register')},
  {method: 'post',   path: '/login',      config: require('../definitions/users/login')},
  {method: 'delete', path: '/logout',     config: require('../definitions/users/logout')},
  {method: 'get',    path: '/status',     config: require('../definitions/users/status')},
  {method: 'get',    path: '/notes',      config: require('../definitions/notes/list')},
  {method: 'get',    path: '/notes/{id}', config: require('../definitions/notes/show')},
  {method: 'delete', path: '/notes/{id}', config: require('../definitions/notes/delete')},
  {method: 'post',   path: '/notes',      config: require('../definitions/notes/create')}
];
