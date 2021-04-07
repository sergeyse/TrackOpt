'use strict';



angular.module('aksturApp')
    .filter('ready', function () {
        return function (input) {
            if (input === "YES") {
                return 'isready';
            } else return;
        };
    });
