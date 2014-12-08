(function(){
  'use strict';

  angular.module('note-taker')
    .factory('Note', ['$http', function($http){

      function list(query){
        return $http.get('/notes?limit=' + query.limit + '&offset=' + query.offset + '&tag=' + query.tag);
      }

      function remove(id){
        return $http.delete('/notes/' + id);
      }

      function findOne(id){
        return $http.get('/notes/' + id);
      }

      return {list:list, remove:remove, findOne:findOne};
    }]);
})();
