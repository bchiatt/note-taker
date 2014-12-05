(function(){
  'use strict';

  angular.module('note-taker')
    .controller('NotesListCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
      Note.list(10).then(function(response){
        $scope.notes = response.data;
      });

      $scope.remove = function(id, index){
        Note.remove(id).then(function(response){
          $scope.notes.splice(index, 1);
        });
      };

      $scope.addNote = function(){
        $state.go('notes.new');
      };
    }]);
})();
