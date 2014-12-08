(function(){
  'use strict';

  angular.module('note-taker')
    .controller('NotesListCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
      $scope.query = {
                       limit:  $state.params.limit || 5,
                       offset: $state.params.offset || 0,
                       tag:    $state.params.tag || '%'
                     };

      $scope.queryNotes = function(){
        Note.list($scope.query).then(function(response){
          $scope.notes = response.data;
        });
      };

      $scope.queryNotes();

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
