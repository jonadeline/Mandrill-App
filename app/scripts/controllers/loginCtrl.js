/*global $:false */
'use strict';


app.controller('loginCtrl', function($scope, $state, $rootScope, $firebase, loginService, usSpinnerService) {

    $rootScope.signIn = function(email, password) {
        $scope.err = null;
        if (!$scope.login.email) {
            $scope.err = 'Please enter an email address';
        } else if (!$scope.login.password) {
            $scope.err = 'Please enter a password';
        } else {
            usSpinnerService.spin('spinner');
            loginService.init();
            loginService.login(email, password, function(err, user) {
                if (!err) {
                    $state.go('clients');
                } else {
                    usSpinnerService.stop('spinner');
                    console.log(err);
                }
            });
        }
    };

    // attempt to log the user in with your preferred authentication provider

});
