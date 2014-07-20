/*global $:false */
'use strict';

app.controller('headerCtrl', function($scope, $state, $firebase, $rootScope, loginService) {

    //checking wether user is logged in or not.
    var isLoggedIn = localStorage.getItem('firebaseSession');

    if (isLoggedIn && isLoggedIn !== 'null' && isLoggedIn !== 'undefined') {
        $scope.loggedIn = true;
    } else {
        $scope.loggedIn = false;
    }

    $scope.logout = function() {
        loginService.init();
        loginService.logout();
        $('.modal-backdrop').remove(); //fix black overlay bootstrap issue.
        $state.go('login');
    }

});
