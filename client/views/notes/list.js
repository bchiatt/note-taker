(function(){
  'use strict';

  angular.module('note-taker')
    .controller('NotesListCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
      $scope.addNote = function(){
        $state.go('notes.new');
      };
    }]);
})();
