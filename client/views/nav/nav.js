(function(){
  'use strict';

  angular.module('note-taker')
    .controller('NavCtrl', ['$rootScope', '$scope', '$state', 'User', function($rootScope, $scope, $state, User){
      $scope.logout = function(){
        User.logout().then(function(){
          $rootScope.rootuser = null;
          toastr.success('User successfully logged out.');
          $state.go('home');
        });
      };
    }]);
})();
