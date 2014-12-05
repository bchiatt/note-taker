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

      function remove(id){
        return $http.delete('/notes/' + id);
      }

      return {list:list, create:create, remove:remove};
    }]);
})();
