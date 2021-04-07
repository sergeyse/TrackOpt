'use strict';

angular.module('aksturApp')
  .controller('MainCtrl', ['$scope', 'simpleLogin', '$location', 'fbUrl','firebase', function ($scope, simpleLogin, $location, fbUrl,firebase) {

    /*simpleLogin.$login('password',{
     email:'sergiy@simnet.is',
     password:''
     }).then(function(user){
     console.log("logged in as", user.uid,user.email);
     },function(error){
     console.log("Login Failed",error);
     });*/

//        ----------------- connection check is not working since we need a google map download first and then bootstrap an angular --------------
    //  var connectedRef = new Firebase("akstur.firebaseio.com/.info/connected");
 /*   var connectedRef = new Firebase(fbUrl + ".info/connected");
    connectedRef.on("value", function (snap) {
      if (snap.val() === true) {

        $scope.online = false;
      } else {

      }
    });*/

//        ----------------- END connection check is not working since we need a google map download first and then bootstrap an angular --------------


// TODO remove test credentials


           /*TODO Add - Remove in production credantials for an auto login to firebase */
    $scope.login = function () {<!--   ============================= Refactoring ========================  -->



        /*firebase.auth().signInWithEmailAndPassword($scope.inputEmail, $scope.inputPassword)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                    console.log('Error login ', errorMessage);
                }
                console.log(error);
            });
*/



        simpleLogin.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function() {
                // Existing and future Auth states are now persisted in the current
                // session only. Closing the window would clear any existing state even
                // if a user forgets to sign out.
                // ...
                // New sign-in will be persisted with session persistence.
                return firebase.auth().signInWithEmailAndPassword($scope.inputEmail, $scope.inputPassword)
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if (errorCode === 'auth/wrong-password') {
                            alert('Wrong password.');
                        } else {
                            alert(errorMessage);
                            console.log('Error login ', errorMessage);
                        }
                        console.log(error);
                    });
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
            });

        console.log('Loged in as: ', firebase.auth().currentUser.email);


        $location.path('/mainView')

    }


        <!--   ============================= END Refactoring ========================  -->
/*      console.log("func fired");
      simpleLogin.$login('password', {
        email: $scope.inputEmail,
        password: $scope.inputPassword,

        rememberMe: true
      }).then(function (user) {
        console.log("logged in as", user.uid, user.email);
        $location.path('/mainView')

      }, function (error) {
        $scope.error = error;
        console.log("Login Failed", error);
        $scope.loginfaile = true;
      });

    }*/
    // todo remove selflogin
    // $scope.login();


  }]);
