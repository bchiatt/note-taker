(function(){
  'use strict';

  angular.module('note-taker')
  .controller('NotesNewCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
    $scope.note = {};

    $scope.create = function(){
      Note.create($scope.note).then(function(response){
        $state.go('notes.list');
      });
    };
  }]);
})();
