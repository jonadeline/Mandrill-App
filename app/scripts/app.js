'use strict';

angular.module('greetingsApp', ['ngRoute', 'LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/send-ecard.html',
        controller: 'sendCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
