'use strict';

angular.module('greetingsApp', ['ngRoute', 'LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/send-ecard.html',
        controller: 'sendCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
