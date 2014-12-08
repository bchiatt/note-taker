(function(){
  'use strict';

  angular.module('note-taker')
    .controller('NotesShowCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
      Note.findOne($state.params.id).then(function(response){
        console.log(response);
        $scope.note = response.data;
      });

      $scope.remove = function(id){
        Note.remove(id).then(function(response){
          $state.go('notes.list');
        });
      };
    }]);
})();
