'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:AddgifteeCtrl
 * @description
 * # AddgifteeCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('ModalCtrl', function ($scope, close) {
    $scope.close = function(result) {
     	close(result, 500); // close, but give 500ms for bootstrap to animate
     };
     $scope.imageCropStep = "1";

  });
