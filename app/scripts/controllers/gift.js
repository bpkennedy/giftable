'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:GiftCtrl
 * @description
 * # GiftCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('GiftCtrl', function ($scope, Ref, $routeParams, GiftSvc) {
    //var authData = Ref.getAuth();
    $scope.giftId = $routeParams.id;
    $scope.gift = new GiftSvc($scope.giftId);
  });
