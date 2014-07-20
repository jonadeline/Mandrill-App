/*global $:false */
'use strict';


app.controller('loginCtrl', function($scope, $state, loginService, usSpinnerService) {

    $scope.signIn = function(email, password) {
      $scope.authError = {};
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
                    $scope.authError.status = true;
                    if (err.code === 'INVALID_USER'){
                      $scope.authError.msg = 'We can\'t find your email in our database. Please retry.';
                    }
                    else if (err.code === 'INVALID_PASSWORD'){
                      $scope.authError.msg = 'Your password is incorrect. Please retry or reset it.';
                    }

                }
            });
        }
    };

    // attempt to log the user in with your preferred authentication provider

});
