(function(){
  'use strict';

  angular.module('note-taker')
    .factory('Note', ['$http', function($http){

      function list(limit){
        return $http.get('/notes?limit=' + limit);
      }

      function remove(id){
        return $http.delete('/notes/' + id);
      }

      return {list:list, remove:remove};
    }]);
})();
