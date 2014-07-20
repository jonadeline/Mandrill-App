/*global $:false */
'use strict';
app.controller('clientsCtrl', function($scope, $firebase, firebaseRef, syncData, usSpinnerService) {

    //console.log(checkLogin);
    $scope.clients = syncData('clients', 10);
    $scope.clients.$on("loaded", function() {
        usSpinnerService.stop('spinner');
    });



});
