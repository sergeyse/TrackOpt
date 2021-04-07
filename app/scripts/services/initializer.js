'use strict';

angular.module('aksturApp')
    .factory('Initializer',["$window","$q", function($window, $q){

        // maps loader deferred object
        var mapsDefer = $q.defer();

        // Google's url for async maps initialization accepting callback function https://console.developers.google.com/apis/credentials?project=devakstur
        var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBfcU0wMzZ0Pf17uhIThYVNwPv2wdcQAwM&libraries=places&callback=';

        // async loader
        var asyncLoad = function(asyncUrl, callbackName) {
            var script = document.createElement('script');
            //script.type = 'text/javascript';
            script.src = asyncUrl + callbackName;
            document.body.appendChild(script);
        };

        // callback function - resolving promise after maps successfully loaded
        $window.googleMapsInitialized = function () {
            mapsDefer.resolve();
        };

        // loading google maps
        asyncLoad(asyncUrl, 'googleMapsInitialized');

        return {

            // usage: Initializer.mapsInitialized.then(callback)
            mapsInitialized : mapsDefer.promise
        };
    }]);
