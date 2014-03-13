'use strict';

angular.module('greetingsApp')
    .controller('sendCtrl', function($scope, localStorageService, myServices) {


    //useful regexp for form verification
    $scope.pattern1 = /^[A-Za-z\s]+$/; // Letters, spaces
    $scope.pattern2 = /^[A-Za-z0-9 ]*$/; // Letters, spaces and numbers

    //initialize recipients array
    $scope.recipients = [];

    //Initialize Mandrill with API KEY
    var m = new mandrill.Mandrill('7df1de52-51f9-4671-927d-bd431d352b46', true);

    //Pre-populate form with user data
    if (localStorageService.isSupported) {
        if (localStorageService.get('userData'))
            $scope.user = localStorageService.get('userData');
    } else {
        localStorageService.cookie.get('userData', $scope.user);
    }

    // Store user's filled data with LocalStorage if supported, if not store in cookie
    $scope.$watch(function() {
        if (localStorageService.isSupported)
            localStorageService.add('userData', $scope.user);
        else
            localStorageService.cookie.add('userData', $scope.user);
    });


    $scope.addRecipient = function() {
        $scope.recipients.push($scope.recipient);
        $scope.recipient = '';
    }

    $scope.removeRecipient = function(index) {
        $scope.recipients.splice(index, 1);
    }


    $scope.generateID = function(L) {
        var s = '';
        var randomchar = function() {
            var n = Math.floor(Math.random() * 62);
            if (n < 10) return n; //1-10 
            if (n < 36) return String.fromCharCode(n + 55); //A-Z
            return String.fromCharCode(n + 61); //a-z 
        }
        while (s.length < L) s += randomchar();
        $scope.sendingID = s;
    }

    $scope.previewEmail = function() {

        var params = {
            "template_name": "test",
            "template_content": [{
                "name": "main",
                "content": $scope.mailContent
            }, {
                "name": "signature",
                "content": $scope.user.signature
            }, {
                "name": "cta",
                "content": "<a href='http://localhost:9000/landing?file=" + $scope.sendingID + "'><img style='border:none;' src='http://voeux.iseabloom.com/img/mail/btn-voir.png' width='345' height='58'/></a>"
            }]
        };


        //Get Preview Template from Mandrill
        m.templates.render(params, function(object) {
            myServices.createEmailPreview(object.html, $scope.sendingID).then(function(callback) {
                $scope.emailhtml = '../../previewLogs/emailPreview-' + $scope.sendingID + '.html';
                document.getElementById('emailPrev').contentDocument.location.reload(true);
                var iframe = $("#emailPrev")
                iframe.src = iframe.src;
                $('#previewEmail').modal();
                //$('#previewEmail').modal({
                //remote: '../../previewLogs/emailPreview-'+$scope.sendingID+'.html'
                //})
            });

        }, function(err) {
            onErrorLog(err);
        });

    }


    $scope.submitForm = function($http) {

        //set mandrill params and send email to all recipients
        var params = {
            "template_name": "test",
            "template_content": [{
                "name": "main",
                "content": $scope.mailContent
            }, {
                "name": "signature",
                "content": $scope.user.signature
            }, {
                "name": "cta",
                "content": "<a href='http://localhost:9000/landing?file=" + $scope.sendingID + "'><img style='border:none;' src='http://voeux.iseabloom.com/img/mail/btn-voir.png' width='345' height='58'/></a>"
            }],
            "message": {
                "subject": $scope.mailSubject,
                "from_email": $scope.user.email,
                "from_name": $scope.user.firstName + " " + $scope.user.lastName,
                "to": $scope.recipients,
                "headers": {
                    "Reply-To": $scope.user.email
                },
                "tags": [
                    "iseaTest"
                ],
                "track_opens": true,
                "track_clicks": true,
            }
        };
        m.messages.sendTemplate(params); // Send Email Template

        //send a copy to the sender if required
        if ($scope.copyEmail) {
            params.message.to = []; // Empty recipients array
            params.message.to = $scope.user; // Add sender mail as recipient
            m.messages.sendTemplate(params); // Send Email Template
        }

        // Create txt file containing custom e-card message (useful for Flash animation)
        myServices.createTxtFile($scope.sendingID, $scope.ecardContent).then(function(callback) {
            alert(callback)
        });


    }


})
/*
    .service('googleLogin', ['$http', '$rootScope', '$q',
        function($http, $rootScope, $q) {
            var clientId = '{MY CLIENT ID}',
                apiKey = '{MY API KEY}',
                scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.google.com/m8/feeds',
                domain = '{MY COMPANY DOMAIN}',
                userEmail,
                deferred = $q.defer();

            this.login = function() {
                gapi.auth.authorize({
                    client_id: clientId,
                    scope: scopes,
                    immediate: false,
                    hd: domain
                }, this.handleAuthResult);

                return deferred.promise;
            }

            this.handleClientLoad = function() {
                gapi.client.setApiKey(apiKey);
                gapi.auth.init(function() {});
                window.setTimeout(checkAuth, 1);
            };

            this.checkAuth = function() {
                gapi.auth.authorize({
                    client_id: clientId,
                    scope: scopes,
                    immediate: true,
                    hd: domain
                }, this.handleAuthResult);
            };

            this.handleAuthResult = function(authResult) {
                if (authResult && !authResult.error) {
                    var data = {};
                    gapi.client.load('oauth2', 'v2', function() {
                        var request = gapi.client.oauth2.userinfo.get();
                        request.execute(function(resp) {
                            $rootScope.$apply(function() {
                                data.email = resp.email;
                            });
                        });
                    });
                    deferred.resolve(data);
                } else {
                    deferred.reject('error');
                }
            };

            this.handleAuthClick = function(event) {
                gapi.auth.authorize({
                    client_id: clientId,
                    scope: scopes,
                    immediate: false,
                    hd: domain
                }, this.handleAuthResult);
                return false;
            };

        }
    ]);
*/
    .factory('myServices', function($http) {
        return {
            createTxtFile: function(sendingID, ecardContent) {
                //since $http.get returns a promise,
                //and promise.then() also returns a promise
                //that resolves to whatever value is returned in it's 
                //callback argument, we can return that.
                var data = {
                    sendingID: sendingID,
                    ecardContent: ecardContent
                };
                var postData = $.param(data); // serialize data for sending to php script through POST method
                return $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url: '/scripts/php/createTxtFile.php',
                    data: postData
                }).then(function(result) {
                    return result.data;
                });

            },
            createEmailPreview: function(html, sendingID) {
                //since $http.get returns a promise,
                //and promise.then() also returns a promise
                //that resolves to whatever value is returned in it's 
                //callback argument, we can return that.
                var data = {
                    html: html,
                    sendingID: sendingID
                };
                var postData = $.param(data); // serialize data for sending to php script through POST method
                return $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url: '/scripts/php/createEmailPreview.php',
                    data: postData
                }).then(function(result) {
                    return result.data;
                });

            }

        }
    });
