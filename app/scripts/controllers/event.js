'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('EventCtrl', function ($scope, Ref, $routeParams, EventSvc) {
    var authData = Ref.getAuth();
    $scope.eventId = $routeParams.id;
    $scope.event = new EventSvc($scope.eventId);
  });
