/*global mandrill:false */
'use strict';
angular.module('mandrillApp', ['ngRoute', 'LocalStorageModule'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/send-ecard.html',
                controller: 'sendCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .factory('mandrill', function() {
        return{
          initMandrill: function(){
            return new mandrill.Mandrill('ReWf5qM6RFFZH-KMqCz4jA', true);
          }
        };
    });
