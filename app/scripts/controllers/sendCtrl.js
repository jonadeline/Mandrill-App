/*global $:false */
'use strict';


app.controller('sendCtrl', function($scope, localStorageService, mandrill) {

    //Init mandrill
    var m = mandrill.initMandrill();
    var params = {
        key: m.apikey
    };

    //useful regexp for form verification
    $scope.pattern1 = /^[A-Za-z\s]+$/; // Letters, spaces
    $scope.pattern2 = /^[A-Za-z0-9 ]*$/; // Letters, spaces and numbers

    //initialize recipients array
    $scope.recipients = [];
    $scope.emailTemplates = [];

    //Populate form with user data if available
    if (localStorageService.isSupported) {
        if (localStorageService.get('userData')) {
            $scope.user = localStorageService.get('userData');
        } else {
            localStorageService.cookie.get('userData', $scope.user);
        }
    }

    // Store user's data in localstorage or cookie.
    $scope.$watch(function() {
        if (localStorageService.isSupported) {
            localStorageService.add('userData', $scope.user);
        } else {
            localStorageService.cookie.add('userData', $scope.user);
        }
    });

    $scope.addRecipient = function() {
        $scope.recipients.push($scope.recipient);
        $scope.recipient = '';
    };

    $scope.getCopy = function() {
        $scope.recipients.push($scope.user.email);
    };

    $scope.removeRecipient = function(index) {
        $scope.recipients.splice(index, 1);
    };

    $scope.getEmailTemplates = function() {
        m.templates.list(params, function(data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                $scope.emailTemplates.push(data[i].name);
            }
            $scope.emailTemplate = data[0].name;
        }, function(error) {
            console.log(error);
        });
    };

    $scope.previewEmail = function() {

        //Clear modal content
        $('.modal-body').empty();

        var params = {
            'template_name': $scope.email.template,
            'template_content': [{
                'name': 'title',
                'content': $scope.mail.subject,
            }, {
                'name': 'main',
                'content': $scope.mail.content
            }, {
                'name': 'signature',
                'content': $scope.user.signature
            }]
        };

        //Get Preview Template from Mandrill
        m.templates.render(params, function(data) {
            $('.modal-body').append(data.html);
        }, function(err) {
            console.log(err);
        });

    };

    $scope.submitForm = function() {


        //set mandrill params and send email to all recipients
        var params = {
            'template_name': $scope.email.template,
            'template_content': [{
                'name': 'title',
                'content': $scope.mail.subject,
            }, {
                'name': 'main',
                'content': $scope.mail.content
            }, {
                'name': 'signature',
                'content': $scope.user.signature
            }],
            'message': {
                'subject': $scope.mail.object,
                'from_email': $scope.user.email,
                'from_name': $scope.user.firstName + ' ' + $scope.user.lastName,
                'to': $scope.recipients,
                'headers': {
                    'Reply-To': $scope.user.email
                },
                'tags': [
                    $scope.email.tag
                ],
                'track_opens': true,
                'track_clicks': true,
            }
        };

        mandrill.messages.sendTemplate(params); // Send Email Template



    };


});
