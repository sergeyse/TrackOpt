'use strict';

angular.module('aksturApp')
    .controller('OrdersdumpCtrl', [ '$scope', '$firebase', '$filter', '$location', 'currentUser', 'simpleLogin' , 'fbUrl','dumpUrl','$routeParams', function ($scope, $firebase, $filter, $location, currentUser, simpleLogin, fbUrl,dumpUrl,$routeParams) {

        if (!currentUser) {
            $location.path('/')
        }
        ;

        $scope.value= $routeParams.dateId;
        console.log('date from route'+ $scope.value);

        $scope.user = currentUser.email;
        $scope.logout = function () {
            simpleLogin.$logout();
            console.log("loged Out!");
            $location.path('#/');
        }
        $scope.alerts=[];
        $scope.redirectAkstur = function(){
            console.log('Dumphere we redirecting  to AKSTRU a tab');
            $location.path('/mainView');
        };
        $scope.redirectPontunar = function(){

            console.log('Dump here we redirecting  to PONTUNAR  tab');
        }


        var locationList = null;

        $scope.velja = function () {


            var ref = $firebase(new Firebase(dumpUrl + $scope.value + "/"));

            locationList = ref.$asArray();
            locationList.$loaded().then(function () {


                //-----------Priority sorting as integer or float in a table is  not working
                /*   angular.forEach(locationList,function(task){
                 task.priority= parseFloat(task.priority);
                 });*/

                // ------------------------------ end ------------
                $scope.allTasksToday = locationList;
                console.log("list has " + locationList.length);





            });
          //  $scope.DateForm.$setPristine();


            //----------------------------try dirty
            //TODO find a better solution use  .this ? for var locatonList inside function
            locationList.$watch(

                function (event) {
                    console.log('hello form wathc');

                    if (event.event === "child_changed") {
                        var objectChanged = $firebase(new Firebase(dumpUrl + $scope.value + "/" + event.key)).$asObject();

                        objectChanged.$loaded().then(function () {
                            /*     console.log('street', objectChanged.street);
                             $scope.alertMsg = $scope.alertMsg + objectChanged.street + '  ---  ';*/
                            $scope.alerts.push({msg:objectChanged.nafn+' - Hefur breyst'});
                        });
                        $scope.closeAlert = function(index){
                            $scope.alerts.splice(index ,1);
                        }

                        //test an alert
                        // $scope.alert = true;


                    }




                }
            );
            //-----------------------------

        }


        $scope.velja();

    }]);
