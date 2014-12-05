(function(){
  'use strict';

  angular.module('note-taker')
    .factory('Note', ['$http', function($http){

      function list(limit){
        return $http.get('/notes?limit=' + limit);
      }

      function create(note){
        return $http.post('/notes', note);
      }
      return {list:list, create:create};
    }]);
})();
