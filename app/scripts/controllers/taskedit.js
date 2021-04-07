'use strict';

angular.module('aksturApp')
    .controller('TaskeditCtrl', ['$scope', '$routeParams', '$firebase', '$location', '$filter', 'currentUser', 'fbUrl', '$FirebaseObject','simpleLogin', function ($scope, $routeParams, $firebase, $location, $filter, currentUser, fbUrl, $FirebaseObject, simpleLogin) {
        //console.log($routeParams);
        /*if (!currentUser.email) {
            $location.path('/')
        }*/


        //=========== BEGIN Refactoring===================

        simpleLogin.onAuthStateChanged(function (usr) {

            if (usr) {
                // User is signed in.
                $scope.usrMail = usr.email;
                console.log(usr);
            } else {
                // No user is signed in.
                $location.path('/')
            }

        });

        //=========== END Refactoring===================



        var dateId = $routeParams.dateId;
        var aksturPush = {};
        //  $scope.editTask ={};

        /* ================================DEPRECATED============================
         var task = $firebase(new Firebase(fbUrl+ $routeParams.dateId + "/" + $routeParams.taskId)).$asObject();


         */

        // =============== BEGIN REFACTORING ================
        var taskRef = firebase.database().ref().child($routeParams.dateId + "/" + $routeParams.taskId);
        var task = $FirebaseObject(taskRef);
        // =============== END REFACTORING ================

        $scope.backToday = $filter('date')(Date.now(), 'dd-MMM');
        $scope.forDay = $routeParams.dateId;

        /*         DO NOT remeber what was this for :)
         var allTasks = $firebase(new Firebase(fbUrl + $routeParams.dateId + "/")).$asArray();
         allTasks.$loaded().then(function () {
         $scope.allTasks = allTasks;

         });*/

        // --------- data reschedule feature -----

        task.$loaded().then(function () {
            $scope.editTask = task;

        });

        $scope.delTask = function () {

            /*            ===============DEPRECATED
             var sync = $firebase(new Firebase(fbUrl + $routeParams.dateId + "/" + $routeParams.taskId));
             sync.$remove().then(function () {
             console.log('removed ');
             $location.path('/mainView');
             })
             */

            // =============== BEGIN REFACTORING ================

            task.$remove().then(function () {
                //deleted
                $location.path('/mainView');
            }, function (error) {
                console.log('error during deleting record: ', error);
            })
            // =============== END REFACTORING ================

        }

        $scope.taskRec = function () {
            // local variable  on a tascRec  to record changes to an object to push
            var taskModified = $filter("date")(Date.now(), 'yyyy-MM-dd HH:mm:ss');
            var usermail = $scope.usrMail;

            //---------modification for a data change
            if ($routeParams.dateId === $scope.forDay) {
                console.log('data parameter', $scope.forDay);
                $scope.editTask.taskModified = taskModified;
                $scope.editTask.modifEmail = usermail;

                $scope.editTask.$save().then(function () {
                    $location.path('/mainView');
                });

            } else {


                // =============== BEGIN REFACTORING ================
                var changedDayRef = firebase.database().ref().child($scope.forDay);

                // =============== END REFACTORING ================

                /*   var refOfDay = $firebase(new Firebase(fbUrl + dateId));
                 refOfDay.$remove($scope.editTask.$id);

                 var r = $firebase(new Firebase(fbUrl + $scope.forDay + "/"));
                 */
                //first create new object and then push
                aksturPush.aksturT = $scope.editTask.aksturT;
                aksturPush.creationTime = $scope.editTask.creationTime;
                aksturPush.lastModif = new Date();
                aksturPush.efni = $scope.editTask.efni;
                aksturPush.lat = $scope.editTask.lat;
                aksturPush.lng = $scope.editTask.lng;
                aksturPush.nafn = $scope.editTask.nafn;
                aksturPush.street = $scope.editTask.street;
                aksturPush.taskModified = taskModified;
                aksturPush.usermail = $scope.editTask.usermail;
                aksturPush.modifEmail = usermail;
                aksturPush.deliveryTime = $scope.editTask.deliveryTime;
                aksturPush.delivered = $scope.editTask.delivered;
                aksturPush.checked = $scope.editTask.checked;
                aksturPush.car = $scope.editTask.car;
                aksturPush.fulltxt = $scope.editTask.fulltxt;
                aksturPush.priority = $scope.editTask.priority;
                aksturPush.wideTime = $scope.editTask.wideTime;
                aksturPush.outofhouse = $scope.editTask.outofhouse;

                /*    r.$push(aksturPush).then(function () {

                 console.log('akstur obj ', aksturPush);
                 $location.path('/mainView');
                 });*/

                changedDayRef.push(aksturPush).then(function () {
                    //remove record and move to a new day
                    task.$remove().then(function () {
                        console.log('record pushed to a new day and removed form an old day');
                        $location.path('/mainView');
                    }, function (error) {
                        console.log('error pushing record ', error);
                    })
                }, function (error) {
                    console.log('error pushing record ', error);
                })

            }

            //---------------------------------------

        }

    }]);
