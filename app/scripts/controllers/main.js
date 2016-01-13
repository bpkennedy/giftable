'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('MainCtrl', function ($scope, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.join = function() {
        $location.path('/people');
    };
  });
