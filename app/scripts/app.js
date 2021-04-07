'use strict';

angular.module('aksturApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'ui.bootstrap',
  'ngAnimate'

])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/createNewTask/:dateId', {
        templateUrl: 'views/createnewtask.html',
        controller: 'CreatenewtaskCtrl',
        resolve: {
            "currentUser": ["simpleLogin", function (simpleLogin) {
                return simpleLogin.currentUser;


            }]
        }
      })
      .when('/mainView', {
        templateUrl: 'views/mainview.html',
        controller: 'MainviewCtrl',
        resolve: {
          "currentUser": ["simpleLogin", function (simpleLogin) {
            return simpleLogin.currentUser;


          }]
        }
      })
      .when('/taskedit/Date/:dateId/task/:taskId', {
        templateUrl: 'views/taskedit.html',
        controller: 'TaskeditCtrl',
        resolve: {
            "currentUser": ["simpleLogin", function (simpleLogin) {
                return simpleLogin.currentUser;


            }]
        }

      })
      .when('/ordersDump/:dateId', {
        templateUrl: 'views/ordersdump.html',
        controller: 'OrdersdumpCtrl',
        resolve: {
            "currentUser": ["simpleLogin", function (simpleLogin) {
                return simpleLogin.currentUser;


            }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  //------------------- DO NOT FORGET TO CHANGE URI FOR A -=PRODUCTION=-  https://akstur.firebaseio.com/             ------------
   .value('fbUrl', 'https://akstur.firebaseio.com/')// todo make this insted of url in controllers
   .value('dumpUrl','https://akstur.firebaseio.com/dump/')
 // .value('fbUrl', 'https://devakstur.firebaseio.com/')
 // .value('dumpUrl', 'https://devakstur.firebaseio.com/dump/')
  .service('simpleLogin', [ 'fbUrl', '$firebaseAuth',function ( fbUrl,$firebaseAuth) {

   /*   DEPRECATED
    var ref = new Firebase(fbUrl);
    console.log("login" + $firebaseSimpleLogin(ref));
    return $firebaseSimpleLogin(ref);
    */

      <!--   ============================= Refactiring ========================  -->
 return firebase.auth();
     // return $firebaseAuth();

      <!--   ============================= END Refactiring ========================  -->

  }])
 /* .run(function () {
    FastClick.attach(document.body);

  })*/;

