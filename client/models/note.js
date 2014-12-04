(function(){
  'use strict';

  angular.module('note-taker')
    .factory('Note', ['$http', function($http){

      function list(){
        return $http.get('/notes');
      }

      function create(note){
        return $http.post('/notes', note);
      }
      return {list:list, create:create};
    }]);
})();
