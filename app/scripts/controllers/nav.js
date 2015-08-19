'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('NavCtrl', function ($scope, $location) {
    $scope.isCurrentPath = function (path) {
      return $location.path() == path;
    };
  });
