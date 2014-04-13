'use strict';

angular.module('mandrillApp', ['ngRoute', 'LocalStorageModule'])
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
