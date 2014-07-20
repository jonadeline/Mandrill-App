/*global mandrill:false */
'use strict';



var app = angular.module('mandrillApp', ['ui.router', 'LocalStorageModule', 'firebase', 'angularSpinner']);

var isLoggedIn = function($firebaseSimpleLogin, $state, firebaseRef, $rootScope) {
    return $firebaseSimpleLogin(firebaseRef())
        .$getCurrentUser() // this returns a promise
        .then(function(user) {
            if (user) {
                return;
            } else {
                $state.go('login');
            }
        });
};

var pathRef = function(args) {
    for (var i = 0; i < args.length; i++) {
        if (typeof(args[i]) === 'object') {
            args[i] = pathRef(args[i]);
        }
    }
    return args.join('/');
};


app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // configure html5 to get links working
    // If you don't do this, you URLs will be base.com/#/home rather than base.com/home
    $locationProvider.html5Mode(true);

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/login');
    //
    // Now set up the states
    $stateProvider
        .state('clients', {
            url: '/clients',
            views: {
                'header@': {
                    templateUrl: 'partials/header.html',
                    controller: 'headerCtrl'
                },
                'container@': {
                    templateUrl: 'partials/clients.html',
                    controller: 'clientsCtrl'
                },
            },
            resolve: {
                checkLogin: isLoggedIn // function that returns a promise
            }
        })
        .state('form', {
            url: '/form',
            views: {
                'header@': {
                    templateUrl: 'partials/header.html',
                    controller: 'headerCtrl'
                },
                'container@': {
                    templateUrl: 'partials/send-ecard.html',
                    controller: 'sendCtrl'
                },
            },
            resolve: {
                checkLogin: isLoggedIn // function that returns a promise
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'header@': {
                    templateUrl: 'partials/header.html',
                    controller: 'headerCtrl'
                },
                'container@': {
                    templateUrl: 'partials/login.html',
                    controller: 'loginCtrl'
                },
            }
        });
});



app.constant('FBURL', 'https://greetings-db.firebaseio.com/');


app.factory('mandrill', function() {
    return {
        initMandrill: function() {
            return new mandrill.Mandrill('ReWf5qM6RFFZH-KMqCz4jA', true);
        }
    };
});

// a simple utility to create references to Firebase paths
app.factory('firebaseRef', ['Firebase', 'FBURL',
    function(Firebase, FBURL) {
        /**
         * @function
         * @name firebaseRef
         * @param {String|Array...} path
         * @return a Firebase instance
         */
        return function(path) {
            return new Firebase(pathRef([FBURL].concat(Array.prototype.slice.call(arguments))));
        };
    }
]);

// a simple utility to create $firebase objects from angularFire
app.factory('syncData', ['$firebase', 'firebaseRef',
    function($firebase, firebaseRef) {
        /**
         * @function
         * @name syncData
         * @param {String|Array...} path
         * @param {int} [limit]
         * @return a Firebase instance
         */
        return function(path, limit) {
            var ref = firebaseRef(path);
            limit && (ref = ref.limit(limit));
            return $firebase(ref);
        }
    }
]);


app.factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef', 'profileCreator', '$timeout',
    function($rootScope, $firebaseSimpleLogin, firebaseRef, profileCreator, $timeout) {
        var auth = null;

        function assertAuth() {
            if (auth === null) {
                throw new Error('Must call loginService.init() before using its methods');
            }
        }

        return {
            init: function() {
                return auth = $firebaseSimpleLogin(firebaseRef());
            },

            /**
             * @param {string} email
             * @param {string} pass
             * @param {Function} [callback]
             * @returns {*}
             */
            login: function(email, pass, callback) {
                assertAuth();
                auth.$login('password', {
                    email: email,
                    password: pass,
                    rememberMe: true
                }).then(function(user) {
                    if (callback) {
                        callback(null, user);
                    }
                }, callback);
            },

            isLoggedIn: function(callback) {
                $firebaseSimpleLogin(firebaseRef())
                    .$getCurrentUser() // this returns a promise
                    .then(function(user) {
                        if (callback) {
                            callback(user);
                        }
                    }, callback);
            },

            logout: function() {
                assertAuth();
                auth.$logout();
            },

            changePassword: function(opts) {
                assertAuth();
                var cb = opts.callback || function() {};
                if (!opts.oldpass || !opts.newpass) {
                    $timeout(function() {
                        cb('Please enter a password');
                    });
                } else if (opts.newpass !== opts.confirm) {
                    $timeout(function() {
                        cb('Passwords do not match');
                    });
                } else {
                    auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function() {
                        cb && cb(null);
                    }, cb);
                }
            },

            createAccount: function(email, pass, callback) {
                assertAuth();
                auth.$createUser(email, pass)
                    .then(function(user) {
                        if (callback) {
                            callback(null, user);
                        }
                    }, callback);
            },

            createProfile: profileCreator
        };

    }
]);

app.factory('profileCreator', ['firebaseRef', '$timeout',
    function(firebaseRef, $timeout) {
        return function(id, email, callback) {
            firebaseRef('users/' + id).set({
                email: email,
                name: firstPartOfEmail(email)
            }, function(err) {
                //err && console.error(err);
                if (callback) {
                    $timeout(function() {
                        callback(err);
                    })
                }
            });

            function firstPartOfEmail(email) {
                return ucfirst(email.substr(0, email.indexOf('@')) || '');
            }

            function ucfirst(str) {
                // credits: http://kevin.vanzonneveld.net
                str += '';
                var f = str.charAt(0).toUpperCase();
                return f + str.substr(1);
            }
        };
    }
]);
