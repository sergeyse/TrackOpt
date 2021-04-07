'use strict';

angular.module('aksturApp')
    .controller('CreatenewtaskCtrl', [ '$scope', 'Initializer', '$firebase', '$location','$filter','currentUser','$routeParams','fbUrl','dumpUrl', 'simpleLogin',function ($scope, Initializer, $firebase, $location,$filter,currentUser,$routeParams,fbUrl,dumpUrl,simpleLogin) {



        $scope.defTask = {};


        //=========== BEGIN Refactoring===================

        simpleLogin.onAuthStateChanged(function (usr) {

            if (usr) {
                // User is signed in.
                var user = usr
                $scope.defTask.usermail = user.email;
                console.log(user);
            } else {
                // No user is signed in.
                $location.path('/')
            }

        });

        //=========== END Refactoring===================


        $scope.d = $routeParams.dateId;
        $scope.aksturT = "Senda";
        $scope.efni = "Nei";
        $scope.gata = ""



      /* var time = new Date ();
        time.setMinutes(0);
        $scope.hstep = 1;
        $scope.mstep = 30;*/








        //todo fix the time of a task creation - use format date
        $scope.defTask.creationTime =  $filter("date")(Date.now(), 'yyyy-MM-dd HH:mm:ss');
        $scope.backToday = $filter ("date")(Date.now(), 'dd-MMM');
        //$scope.defTask.deliveryTime = $filter("date")(Date.now(), 'HH:mm');
        $scope.defTask.wideTime = "idag"
         $scope.defTask.car= "Litill";
        $scope.defTask.outofhouse="NO"
      // $scope.defTask.deliveryTime ="";

        Initializer.mapsInitialized.then(function () {

                $scope.location = '';
                var autocomplete = new google.maps.places.Autocomplete($("#Gata")[0], {
                    componentRestrictions:{
                        country:"is"
                    }
                });

                google.maps.event.addListener(autocomplete, 'place_changed', function () {
                    var place = autocomplete.getPlace();
                    // $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                    $scope.defTask.lat = place.geometry.location.lat();
                    $scope.defTask.lng = place.geometry.location.lng();
                    $scope.defTask.street = place.name

//$scope.applay();
                });
                    $scope.taskRec = function () {
                        $scope.defTask.taskModified = "";
                        $scope.defTask.modifEmail= "";
                        $scope.defTask.aksturT = $scope.aksturT;
                        $scope.defTask.efni = $scope.efni;
                        $scope.defTask.delivered= "NO";
                        $scope.defTask.checked = "NO";
                      // $scope.defTask.deliveryTime = $filter("date")($scope.defTask.deliveryTime , 'HH:mm');
                       // $scope.defTask.car= "1";
                        $scope.defTask.priority ="88" ;
                        console.log('def task '+$scope.defTask.deliveryTime);

                        /*DEPRECATED
                        var ref = $firebase(new Firebase(fbUrl + $scope.d + "/"));*/

                        // =============== BEGIN REFACTORING ================
                        var  ref  = firebase.database().ref().child($scope.d);
                        ref.push($scope.defTask);
                        $location.path('/mainView');

                        // =============== END REFACTORING ================

                        /*ref.$push($scope.defTask).then(function(){

                        $location.path('/mainView');
                        });*/
                    }
              /*  $scope.dumpRec = function(){

                    $scope.defTask.taskModified = "";
                    $scope.defTask.modifEmail= "";
                    $scope.defTask.aksturT = $scope.aksturT;
                    $scope.defTask.efni = $scope.efni;
                    $scope.defTask.delivered= "NO";
                    $scope.defTask.car= "1";
                    $scope.defTask.priority ="1" ;
                    $scope.defTask.lat = 0;
                    $scope.defTask.lng = 0;
                    var ref = $firebase(new Firebase( dumpUrl+ $scope.d + "/"));
                    ref.$push($scope.defTask).then(function(){

                   $location.path('/ordersDump/'+$scope.d+ '/');
                    });

                }*/



            }
        );

    }]);
