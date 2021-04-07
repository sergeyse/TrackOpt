'use strict';

angular.module('aksturApp')
    .filter('deliveredLine', function () {
        console.log("Filter deliv");
        return function (input) {
            if (input === "YES") {
                return 'delivered';
            } else return;

        };
    });
