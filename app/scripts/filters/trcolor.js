'use strict';

angular.module('aksturApp')
    .filter('trcolor', function () {
        return function (input) {
          //  console.log('fiter input = ', input);
            if (input == 1) {
                return 'color1';
            } else if (input == 2) {
                return 'color2';
            } else if (input == 3) {
                return 'color3';
            } else if (input == 4) {
                return 'color4';
            } else if (input == 5) {
                return 'color5';
            } else if (input == 6) {
                return ' color6 ';
            } else if (input == 7) {
                return 'color7';
            } else if (input == 8) {
                return 'color8';
            } else if (input == 9) {
                return 'color9';
            } else if (input == 10) {
                return 'color10';
            } else if (input == 11) {
                return 'color11';
            } else return;

        };
    })
;
