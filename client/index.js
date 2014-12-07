(function(){
  'use strict';

  angular.module('note-taker', ['ui.router', 'angularFileUpload'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home',       {url:'/',         templateUrl:'/views/home/home.html'})
        .state('register',   {url:'/register', templateUrl:'/views/users/users.html', controller:'UsersCtrl'})
        .state('login',      {url:'/login',    templateUrl:'/views/users/users.html', controller:'UsersCtrl'})
        .state('notes',      {url:'/notes',    templateUrl:'/views/notes/notes.html', abstract:true})
        .state('notes.list', {url:'',          templateUrl:'/views/notes/list.html',  controller:'NotesListCtrl'})
        .state('notes.show', {url:'/{id}',     templateUrl:'/views/notes/show.html',  controller:'NotesShowCtrl'})
        .state('notes.new',  {url:'/new',      templateUrl:'/views/notes/new.html',   controller:'NotesNewCtrl'});
    }])
    .run(['$rootScope', '$http', function($rootScope, $http){
      $http.get('/status').then(function(response){
        $rootScope.rootuser = response.data;
      }, function(){
        $rootScope.rootuser = null;
      });
    }]);
})();
