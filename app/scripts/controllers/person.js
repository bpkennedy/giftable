'use strict';

/**
 * @ngdoc function
 * @name giftableApp.controller:PersonCtrl
 * @description
 * # PersonCtrl
 * Controller of the giftableApp
 */
angular.module('giftableApp')
  .controller('PersonCtrl', function ($scope, $routeParams, PersonSvc, Ref, $firebaseArray) {
    $scope.id = $routeParams.id;

    //$scope.person = $firebaseArray(Ref.child('person')).get($scope.id);
    $scope.person = PersonSvc($scope.id);

    $scope.addEvent = function(event) {

    }

  });
