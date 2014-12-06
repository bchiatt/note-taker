(function(){
  'use strict';

  angular.module('note-taker')
  .controller('NotesNewCtrl', ['$scope', '$state', '$upload', 'Note', function($scope, $state, $upload, Note){
    $scope.note = {};
    var files;

    $scope.fileSelected = function(f){
      files = f;
    };

    $scope.create = function(){
      $scope.upload = $upload.upload({
        url: 'notes',
        method: 'POST',
        data: $scope.note,
        file: files
      }).progress(function(evt){
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config){
        console.log('data', data);
        console.log('status', status);
        console.log('headers', headers);
        console.log('config', config);
        $state.go('notes.list');
      });
    };
  }]);
})();
