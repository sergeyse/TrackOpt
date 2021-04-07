//'use strict';

angular.module('aksturApp')
    .controller('MainviewCtrl', ['$scope', 'Initializer', '$firebase', '$filter', '$location', 'currentUser', 'simpleLogin', 'fbUrl', 'firebase', '$firebaseArray', '$FirebaseObject', function ($scope, Initializer, $firebase, $filter, $location, currentUser, simpleLogin, fbUrl, firebase, $firebaseArray, $FirebaseObject) {

        /*if (!currentUser.email) {
         $location.path('/')
         }*/

        //=========== BEGIN Refactoring===================

        simpleLogin.onAuthStateChanged(function (usr) {

            if (usr) {
                // User is signed in.
                var user = usr
                $scope.user = user.email;
                console.log(user);
            } else {
                // No user is signed in.
                $location.path('/')
            }

        });

        //=========== END Refactoring===================

// have chnged it with css class .hidden-lg
        /* if (currentUser.email === "bill1@ispan.is" || currentUser.email === "bill2@ispan.is") {
         $scope.driver = true;

         }*/

        $scope.url = fbUrl;

        $scope.value = $filter("date")(Date.now(), 'yyyy-MM-dd');

        $scope.logout = function () {

            /* simpleLogin.$logout();
             console.log("loged Out!");
             $location.path('#/');*/

            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                $location.path('#/');
            }).catch(function (error) {
                // An error happened.
                alert('Could not sign out', error);
            });
        };
        $scope.alerts = [];
//todo hide buttoms for a car depend on a user name mobile user 
        $scope.isMobileDevice = true;
        if ($scope.user !== "bill1@ispan.is") {
            $scope.isMobileDevice = false;
        }

        //var geoRef = new Firebase(fbUrl + "car/");

        /* $scope.redirectAkstur = function () {
         console.log('here we redirecting  to AKSTRU a tab');
         //  $location.redirect('/ordersdump/'+$scope.value)
         };
         $scope.redirectPontunar = function () {
         $location.path('/ordersDump/' + $scope.value)
         console.log('here we redirecting  to PONTUNAR  tab');
         }*/

        Initializer.mapsInitialized.then(function () {
            console.log("We'v got injection of a map");
            var watchID = 0;
            var carMarker;

            var locationList = null;
            $scope.velja = function () {


                //----------------------- Changing the next day dynamically

                var nextDay = moment($scope.value).add(1, 'days');
                $scope.tomorrow = $filter('date')(new Date(nextDay), 'yyyy-MM-dd');

                //-----------------------END Changing the next day dynamically

                // TODO markers for google map
                // DEPRECATED
                /*   var ref = $firebase(new Firebase(fbUrl + $scope.value + "/"));
                 locationList = ref.$asArray();*/

                // =============== BEGIN REFACTORING ================
                var todayRef = firebase.database().ref();
                var todayChildRef = todayRef.child($scope.value);

                locationList = $firebaseArray(todayChildRef);
                // =============== END REFACTORING ================

                locationList.$loaded().then(function () {




                    // ------------------------------ end ------------
                    $scope.allTasksToday = locationList;
                    console.log("list has " + locationList.length);
                    console.log(locationList);
                    for (var i in $scope.markers) {

                        $scope.markers[i].setMap(null);
                        console.log("inside Velja()");
                    }
                    $scope.markers = [];
                    for (var i = 0; i < locationList.length; i++) {
                        if (locationList[i].delivered === "YES") {

                        } else if (locationList[i].car === "P-Bill") {
                            console.log("car", locationList[i].car);

                        } else if (locationList[i].car === "V-Bill") {
                            console.log("car", locationList[i].car);

                        } else if (locationList[i].car === "Kerra") {
                            console.log("car", locationList[i].car);

                        } else if (locationList[i].car === "Sott") {
                            console.log("car", locationList[i].car);

                        }
                        else {
                            // if (locationList[i].car == "P-Bill" ||"Kerra" || "V-Bill" || "Sott")continue;
                            createMarker(locationList[i]);
                        }

                    }

                });

                $scope.DateForm.$setPristine();

                //----------------------------try dirty
                //TODO find a better solution use  .this ? for var locatonList inside function
                locationList.$watch(
                    function (event) {

                        if (event.event === "child_changed") {
                            console.log('hello form watch');
                            //                     ============== DEPRECATED =======================
                            // var objectChanged = $firebase(new Firebase(fbUrl + $scope.value + "/" + event.key)).$asObject();

                            //========================= BEGIN Refactoring=============================

                            var objectChanged = $FirebaseObject(firebase.database().ref().child($scope.value + "/" + event.key));

                            //========================= END Refactoring=============================

                            objectChanged.$loaded().then(function () {
                                /*     console.log('street', objectChanged.street);
                                 $scope.alertMsg = $scope.alertMsg + objectChanged.street + '  ---  ';*/
                                $scope.alerts.push({msg: objectChanged.street + ' - Hefur breyst'});
                            });
                            $scope.closeAlert = function (index) {
                                $scope.alerts.splice(index, 1);
                            };

                            //test an alert
                            // $scope.alert = true;

                        }
                        for (var i in $scope.markers) {

                            $scope.markers[i].setMap(null);
                            console.log("inside  WATCH loop");
                        }
                        $scope.markers = [];
                        for (var i = 0; i < locationList.length; i++) {
                            if (locationList[i].delivered === "YES") {

                            } else if (locationList[i].car === "P-Bill") {
                                console.log("car", locationList[i].car);

                            } else if (locationList[i].car === "V-Bill") {
                                console.log("car", locationList[i].car);

                            } else if (locationList[i].car === "Kerra") {
                                console.log("car", locationList[i].car);

                            } else if (locationList[i].car === "Sott") {
                                console.log("car", locationList[i].car);

                            }
                            else {
                                // if (locationList[i].car == "P-Bill" ||"Kerra" || "V-Bill" || "Sott")continue;
                                createMarker(locationList[i]);
                            }

                        }

                    }
                );

                //--------------  BEGIN create another list of tasks for next day

                /*     ======================= DEPRECATED =========================
                 var tomorrowRef = $firebase(new Firebase(fbUrl + $scope.tomorrow + "/"));//todo var tomorrow have to change accordingly to a main data change...$scope.value
                 var tomorrowList = tomorrowRef.$asArray();*/

                // =============== BEGIN REFACTORING ================
                var tomorrowRef = firebase.database().ref().child($scope.tomorrow);
                var tomorrowList = $firebaseArray(tomorrowRef);
                // =============== END REFACTORING ================

                tomorrowList.$loaded().then(function () {

                    $scope.allTasksTomorrow = tomorrowList;

                });
                //--------------  END create another list of tasks for next day
            };

            function moveundone() {
                console.log("moving undone");
                var checkforday;
                if (moment().isoWeekday() === 1) {

                    checkforday = $filter('date')(new Date(moment(Date.now()).subtract(3, "days")), 'yyyy-MM-dd');

                } else {
                    checkforday = $filter('date')(new Date(moment(Date.now()).subtract(1, "days")), 'yyyy-MM-dd');

                }

                var today = $filter("date")(Date.now(), 'yyyy-MM-dd');
                var aksturPush = {};
                var r = $firebase(new Firebase(fbUrl + today + "/"));
                console.log("today" + today);

                var chekdayRef = $firebase(new Firebase(fbUrl + checkforday + "/"));

                var checkdayList = chekdayRef.$asArray();
                var id;
                checkdayList.$loaded().then(function () {
                    //console.log("yesterdaylist"+JSON.stringify(checkdayList[0]));
                    //  console.log("ID "+ checkdayList[0].$id);
                    for (var i = 0; i < checkdayList.length; i++) {
                        if (checkdayList[i].delivered === "NO") {
                            aksturPush.aksturT = checkdayList[i].aksturT;
                            aksturPush.creationTime = checkdayList[i].creationTime;
                            aksturPush.lastModif = checkdayList[i].lastModif || " ";
                            aksturPush.efni = checkdayList[i].efni;
                            aksturPush.lat = checkdayList[i].lat;
                            aksturPush.lng = checkdayList[i].lng;
                            aksturPush.nafn = checkdayList[i].nafn;
                            aksturPush.street = checkdayList[i].street;
                            aksturPush.taskModified = checkdayList[i].taskModified;
                            aksturPush.usermail = checkdayList[i].usermail;
                            aksturPush.modifEmail = checkdayList[i].modifEmail;
                            aksturPush.deliveryTime = checkdayList[i].deliveryTime;
                            aksturPush.delivered = checkdayList[i].delivered;
                            aksturPush.checked = checkdayList[i].checked;
                            aksturPush.car = checkdayList[i].car;
                            aksturPush.fulltxt = checkdayList[i].fulltxt;
                            aksturPush.priority = checkdayList[i].priority;
                            aksturPush.wideTime = checkdayList[i].wideTime;
                            aksturPush.outofhouse = checkdayList[i].outofhouse;
                            id = checkdayList[i].$id;
                            r.$push(aksturPush).then(function () {
                                    chekdayRef.$remove(id);
                                }
                            );

                        }

                    }

                })
            }

            // TODO refactor this method
            // moveundone();

            $scope.velja();

//           ----------------BEGINcopypaste------------------------------
            var mapOptions = {
                zoom     : 11,
                center   : new google.maps.LatLng(64.1335, -21.8569),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var image = 'images/ispan.png';

            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

            $scope.markers = [];

            var infoWindow = new google.maps.InfoWindow();

            var createMarker = function (info) {
                //             console.log("info", info);

                var marker = new google.maps.Marker({
                    id      : info.$id,
                    map     : $scope.map,
                    position: new google.maps.LatLng(info.lat, info.lng),
                    title   : info.street,
                    //  icon: image
                    icon    : 'images/' + info.priority + '.png'
                });
                //url for edit  taskedit/Date/'+$scope.value+'/task/'+id+'/'
                marker.content = '<a href="#/taskedit/Date/' + $scope.value + '/task/' + info.$id + '/" ><button  style="color:#2286ff; font-weight: bold;border-color:#2286ff"  class="btn btn-default btn-lg btn-block" ">&nbsp Skoða &nbsp</button> </a>';

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.setContent('<h4><span style="color:#2c4db1">' + marker.title + '</span></h4>' + marker.content);
                    // console.log("Marker" + marker.content);
                    infoWindow.open($scope.map, marker);
                });

                $scope.markers.push(marker);

            };

//----------------- Begin deleting particular marker with an ID that is declared in a google.maps.Marker object and connected to Firebase unique ID--------------------
            /*    function deleteOverlays(id) {

             for (var i in $scope.markers) {
             console.log("for loop begin i.id = " + $scope.markers[i].id);
             if ($scope.markers[i].id == id) {
             $scope.markers[i].setMap(null);
             console.log("inside loop");
             }


             }


             }*/

            $scope.openInfoWindow = function (e, selectedMarker) {
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            };

            $scope.delete = function (geoId) {
                console.log(geoId);

            };

//           ----------------ENDcopypaste------------------------------

            $scope.edit = function (id) {
                console.log("my ID" + '/Date/' + $scope.value + '/task/' + id + '/');
                $location.path('taskedit/Date/' + $scope.value + '/task/' + id + '/');

            };
            $scope.editTomorrow = function (id) {
                $location.path('taskedit/Date/' + $scope.tomorrow + '/task/' + id + '/');

            };

            //TODO make an IF fora  desctop salesmen users in the office only NOT on a tablet which writing data to firebase to avoid traffic ---- check ng-hide="isMobileDevise" to disable CAR Button

            $scope.getCarPosition = function carPositionTest() {
                carMarker = new google.maps.Marker({
                    // id: info.$id,
                    map     : $scope.map,
                    position: new google.maps.LatLng(64.111953, -21.85102900000004),
                    // title: info.street,
                    icon    : 'images/pickup.png'
                });
                // todo
                //  var geoRef = new Firebase(fbUrl+"car/");
                geoRef.on("value", function (geodata) {
                    console.log("geodata", geodata.val());
                    carMarker.setPosition(
                        new google.maps.LatLng(
                            geodata.val().lat,
                            geodata.val().lon
                        )
                    )
                });

            };

            $scope.hideCarPosition = function () {
                geoRef.off("value");
                carMarker.setMap(null);

                /*
                 ref.off("value", originalCallback);
                 if (watchID > 0) {
                 navigator.geolocation.clearWatch(watchID); //method is used to unregister location/error monitoring handlers previously installed using Geolocation.watchPosition().
                 carMarker.setMap(null);
                 //   alert("Stopped Tracking Location");
                 console.log("hideCarPos");
                 }
                 $scope.map.setZoom(11);*/

                //   $scope.hidetable = false;
            };
// This function should be fired from a car only !
            function successGeoData(position) {
                console.log("car position ", position);
                var CarPositionRef = new Firebase(fbUrl + "car/");
                CarPositionRef.set({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                })

                /*   carMarker.setPosition(
                 new google.maps.LatLng(
                 position.coords.latitude,
                 position.coords.longitude)
                 );
                 // align center of a map to a car position -----
                 $scope.map.setCenter(
                 new google.maps.LatLng(
                 position.coords.latitude,
                 position.coords.longitude)
                 );*/
            }

            function failGeoData() {
                console.log("fail geo");
            }

//      ----------------- BEGIN displaying a car position on a map ----------------------
// todo change user email and use it only for a user in a car
            if ($scope.user == "car1@ispan.is") {
                if (navigator.geolocation) {

                    var watchID = navigator.geolocation.watchPosition(successGeoData, failGeoData, {
                        maximumAge        : 5000,
                        enableHighAccuracy: true,
                        timeout           : 5000
                    });
                } else {
                    alert("enable geolocation ");
                }
            }
//      ----------------- END displaying a car position on a map ----------------------
        });
    }]);
