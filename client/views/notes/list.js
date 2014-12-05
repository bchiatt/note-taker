(function(){
  'use strict';

  angular.module('note-taker')
    .controller('NotesListCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
      Note.list(10).then(function(response){
        $scope.notes = response.data;
      });

      $scope.addNote = function(){
        $state.go('notes.new');
      };
    }]);
})();
